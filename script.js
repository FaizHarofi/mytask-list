var FIREBASE_CONFIG = {
  apiKey: "AIzaSyDve3whNT-r0UTt9OpanHhDOTidtFmSKFc",
  authDomain: "task-list-f7a4f.firebaseapp.com",
  projectId: "task-list-f7a4f",
  storageBucket: "task-list-f7a4f.firebasestorage.app",
  messagingSenderId: "834844912067",
  appId: "1:834844912067:web:cc8409f44ca0ec0756b576",
};

var SUBJECTS = {
  web: { label: "Web Prog", short: "WEB", css: "web" },
  mobile: { label: "Mobile Prog", short: "MOB", css: "mobile" },
  database: { label: "Database", short: "DB", css: "database" },
};

var items = [];
var currentFilter = "all";
var currentSubject = "all";
var searchQuery = "";
var editingId = null;
var isAdmin = false;
var firebaseReady = false;
var db = null;
var ICO = {
  arrow:
    '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',
  folder:
    '<svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 12H5v-1h14v1zm0-3H5v-1h14v1zm0-3H5v-1h14v1z"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>',
  logout:
    '<svg viewBox="0 0 24 24"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>',
};

var listEl = document.getElementById("assignmentList");
var loginOvl = document.getElementById("loginOverlay");
var formOvl = document.getElementById("formOverlay");
var loginEmail = document.getElementById("loginEmail");
var loginPass = document.getElementById("loginPass");
var loginError = document.getElementById("loginError");
var fName = document.getElementById("fName");
var fPath = document.getElementById("fPath");
var fSubject = document.getElementById("fSubject");
var fStatus = document.getElementById("fStatus");
var fNote = document.getElementById("fNote");
var searchInput = document.getElementById("searchInput");
var authBtn = document.getElementById("authBtn");
var btnAdd = document.getElementById("btnAdd");

function esc(s) {
  var d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function toast(msg, type) {
  var t = document.createElement("div");
  t.className = "toast " + (type || "");
  t.textContent = msg;
  document.getElementById("toastStack").appendChild(t);
  setTimeout(function () {
    t.classList.add("hiding");
    setTimeout(function () {
      t.remove();
    }, 250);
  }, 2800);
}

function initFirebase() {
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    firebaseReady = false;
    document.getElementById("setupBanner").style.display = "block";
    items = [];
    render();
    return;
  }

  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    firebaseReady = true;

    firebase.auth().onAuthStateChanged(function (user) {
      isAdmin = !!user;
      updateAuthUI(user);
      if (firebaseReady) {
        startListening();
      }
    });
  } catch (e) {
    firebaseReady = false;
    document.getElementById("setupBanner").style.display = "block";
    console.error("[Firebase] Init error:", e);
    items = [];
    render();
  }
}

function updateAuthUI(user) {
  if (user) {
    authBtn.classList.add("logged-in");
    authBtn.innerHTML = ICO.logout + "<span>Logout</span>";
    btnAdd.style.display = "inline-flex";
  } else {
    authBtn.classList.remove("logged-in");
    authBtn.innerHTML = ICO.lock + "<span>Admin Login</span>";
    btnAdd.style.display = "none";
    editingId = null;
    closeFormModal();
  }
  render();
}

function openLoginModal() {
  loginEmail.value = "";
  loginPass.value = "";
  loginError.style.display = "none";
  loginOvl.classList.add("show");
  setTimeout(function () {
    loginEmail.focus();
  }, 80);
}

function closeLoginModal() {
  loginOvl.classList.remove("show");
}

function handleLogin() {
  var email = loginEmail.value.trim();
  var pass = loginPass.value;

  if (!email || !pass) {
    loginError.textContent = "Please enter email and password.";
    loginError.style.display = "block";
    return;
  }

  loginError.style.display = "none";

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then(function () {
      closeLoginModal();
      toast("Logged in as admin.", "ok");
    })
    .catch(function (err) {
      var msg = "Login failed.";
      if (err.code === "auth/user-not-found") msg = "User not found.";
      if (err.code === "auth/wrong-password") msg = "Wrong password.";
      if (err.code === "auth/invalid-email") msg = "Invalid email format.";
      if (err.code === "auth/too-many-requests")
        msg = "Too many attempts. Try again later.";
      if (err.code === "auth/invalid-credential")
        msg = "Invalid email or password.";
      loginError.textContent = msg;
      loginError.style.display = "block";
    });
}

function handleLogout() {
  firebase
    .auth()
    .signOut()
    .then(function () {
      toast("Logged out.", "bad");
    })
    .catch(function () {
      toast("Logout failed.", "bad");
    });
}

var unsubListener = null;

function startListening() {
  if (unsubListener) unsubListener();

  unsubListener = db
    .collection("assignments")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      function (snap) {
        items = [];
        snap.forEach(function (doc) {
          var d = doc.data();
          items.push({
            id: doc.id,
            name: d.name || "",
            path: d.path || "",
            subject: d.subject || "web",
            status: d.status || "pending",
            note: d.note || "",
          });
        });
        render();
      },
      function (err) {
        console.error("[Firebase] Listener error:", err);
        toast("Failed to load data.", "bad");
      },
    );
}

function addAssignment(data) {
  db.collection("assignments")
    .add({
      name: data.name,
      path: data.path,
      subject: data.subject,
      status: data.status,
      note: data.note || "",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(function () {
      toast("Assignment added.", "ok");
    })
    .catch(function () {
      toast("Failed to add.", "bad");
    });
}

function updateAssignment(id, data) {
  db.collection("assignments")
    .doc(id)
    .update(data)
    .then(function () {
      toast("Assignment updated.", "ok");
    })
    .catch(function () {
      toast("Failed to update.", "bad");
    });
}

function deleteAssignment(id) {
  db.collection("assignments")
    .doc(id)
    .delete()
    .then(function () {
      toast("Assignment removed.", "bad");
    })
    .catch(function () {
      toast("Failed to delete.", "bad");
    });
}

function toggleAssignmentStatus(id) {
  var item = items.find(function (x) {
    return x.id === id;
  });
  if (!item) return;
  var newStatus = item.status === "done" ? "pending" : "done";
  db.collection("assignments")
    .doc(id)
    .update({ status: newStatus })
    .catch(function () {
      toast("Failed to update status.", "bad");
    });
}

function openFormModal(id) {
  editingId = id || null;
  document.getElementById("formTitle").textContent = id
    ? "Edit Assignment"
    : "Add Assignment";

  if (id) {
    var item = items.find(function (x) {
      return x.id === id;
    });
    if (!item) return;
    fName.value = item.name;
    fPath.value = item.path;
    fSubject.value = item.subject;
    fStatus.value = item.status;
    fNote.value = item.note || "";
  } else {
    fName.value = "";
    fPath.value = "./";
    fSubject.value = "web";
    fStatus.value = "pending";
    fNote.value = "";
  }

  fName.classList.remove("err");
  fPath.classList.remove("err");
  formOvl.classList.add("show");
  setTimeout(function () {
    fName.focus();
  }, 80);
}

function closeFormModal() {
  formOvl.classList.remove("show");
  editingId = null;
}

function handleFormSave() {
  var name = fName.value.trim();
  var path = fPath.value.trim();
  var hasErr = false;

  if (!name) {
    fName.classList.add("err");
    hasErr = true;
  } else {
    fName.classList.remove("err");
  }

  if (!path) {
    fPath.classList.add("err");
    hasErr = true;
  } else {
    fPath.classList.remove("err");
  }

  if (hasErr) {
    toast("Please fill in the required fields.", "bad");
    return;
  }

  var data = {
    name: name,
    path: path,
    subject: fSubject.value,
    status: fStatus.value,
    note: fNote.value.trim(),
  };

  if (editingId) {
    updateAssignment(editingId, data);
  } else {
    addAssignment(data);
  }

  closeFormModal();
}

// ===== Delete with animation =====
function removeItem(id) {
  var el = document.querySelector('[data-id="' + id + '"]');
  if (el) {
    el.classList.add("removing");
    setTimeout(function () {
      deleteAssignment(id);
    }, 280);
  }
}

function renderStats() {
  var total = items.length;
  var done = items.filter(function (x) {
    return x.status === "done";
  }).length;
  var pending = total - done;
  var web = items.filter(function (x) {
    return x.subject === "web";
  }).length;
  var mobile = items.filter(function (x) {
    return x.subject === "mobile";
  }).length;
  var dbcount = items.filter(function (x) {
    return x.subject === "database";
  }).length;

  document.getElementById("sTotal").textContent = total;
  document.getElementById("sDone").textContent = done;
  document.getElementById("sPending").textContent = pending;
  document.getElementById("sWeb").textContent = web;
  document.getElementById("sMobile").textContent = mobile;
  document.getElementById("sDb").textContent = dbcount;
}

function renderList() {
  var list = items.slice();

  if (currentSubject !== "all") {
    list = list.filter(function (x) {
      return x.subject === currentSubject;
    });
  }

  if (currentFilter === "done") {
    list = list.filter(function (x) {
      return x.status === "done";
    });
  } else if (currentFilter === "pending") {
    list = list.filter(function (x) {
      return x.status === "pending";
    });
  }

  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    list = list.filter(function (x) {
      return (
        x.name.toLowerCase().indexOf(q) !== -1 ||
        x.path.toLowerCase().indexOf(q) !== -1 ||
        (x.note && x.note.toLowerCase().indexOf(q) !== -1) ||
        x.subject.toLowerCase().indexOf(q) !== -1
      );
    });
  }

  if (!list.length) {
    var msg =
      items.length === 0
        ? "No assignments yet. Admin can add new assignments after logging in."
        : "No assignments match your current filters.";
    listEl.innerHTML =
      '<div class="empty-state">' +
      ICO.folder +
      "<h3>Nothing Here</h3>" +
      "<p>" +
      msg +
      "</p>" +
      "</div>";
    return;
  }

  function statusTag(item) {
    var cls = item.status === "done" ? "done" : "pending";
    var txt = item.status === "done" ? "Done" : "Pending";
    if (isAdmin) {
      return (
        '<span class="a-tag clickable ' +
        cls +
        '" onclick="event.preventDefault();event.stopPropagation();toggleAssignmentStatus(\'' +
        item.id +
        '\')" title="Click to toggle">' +
        txt +
        "</span>"
      );
    }
    return '<span class="a-tag ' + cls + '">' + txt + "</span>";
  }

  function actionsHtml(id) {
    if (!isAdmin) return "";
    return (
      '<div class="a-actions" style="opacity:0;">' +
      '<button class="a-act" onclick="openFormModal(\'' +
      id +
      '\')" title="Edit" aria-label="Edit">' +
      ICO.edit +
      "</button>" +
      '<button class="a-act del" onclick="removeItem(\'' +
      id +
      '\')" title="Delete" aria-label="Delete">' +
      ICO.trash +
      "</button>" +
      "</div>"
    );
  }

  listEl.innerHTML = list
    .map(function (it) {
      var sub = SUBJECTS[it.subject] || SUBJECTS.web;
      var noteHtml = it.note
        ? '<span class="a-note">' + esc(it.note) + "</span>"
        : "";

      return (
        '<div class="a-card" data-id="' +
        it.id +
        '">' +
        '<div class="a-strip ' +
        sub.css +
        '"></div>' +
        '<a class="a-link" href="' +
        esc(it.path) +
        '" title="Open: ' +
        esc(it.path) +
        '">' +
        '<div class="a-badge ' +
        sub.css +
        '">' +
        sub.short +
        "</div>" +
        '<div class="a-info">' +
        '<div class="a-name">' +
        esc(it.name) +
        "</div>" +
        '<div class="a-details">' +
        statusTag(it) +
        '<span class="a-path">' +
        esc(it.path) +
        "</span>" +
        noteHtml +
        "</div>" +
        "</div>" +
        "</a>" +
        '<div class="a-arrow">' +
        ICO.arrow +
        "</div>" +
        actionsHtml(it.id) +
        "</div>"
      );
    })
    .join("");

  if (isAdmin) {
    listEl.querySelectorAll(".a-card").forEach(function (card) {
      var acts = card.querySelector(".a-actions");
      if (acts) {
        card.addEventListener("mouseenter", function () {
          acts.style.opacity = "1";
        });
        card.addEventListener("mouseleave", function () {
          acts.style.opacity = "0";
        });
      }
    });
  }
}

function render() {
  renderStats();
  renderList();
}

authBtn.addEventListener("click", function () {
  if (isAdmin) {
    handleLogout();
  } else {
    openLoginModal();
  }
});

document
  .getElementById("loginClose")
  .addEventListener("click", closeLoginModal);
document
  .getElementById("loginCancel")
  .addEventListener("click", closeLoginModal);
document.getElementById("loginSubmit").addEventListener("click", handleLogin);

loginPass.addEventListener("keydown", function (e) {
  if (e.key === "Enter") handleLogin();
});

loginOvl.addEventListener("click", function (e) {
  if (e.target === loginOvl) closeLoginModal();
});

btnAdd.addEventListener("click", function () {
  openFormModal();
});
document.getElementById("formClose").addEventListener("click", closeFormModal);
document.getElementById("formCancel").addEventListener("click", closeFormModal);
document.getElementById("formSave").addEventListener("click", handleFormSave);

fName.addEventListener("keydown", function (e) {
  if (e.key === "Enter") handleFormSave();
});

formOvl.addEventListener("click", function (e) {
  if (e.target === formOvl) closeFormModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (loginOvl.classList.contains("show")) closeLoginModal();
    if (formOvl.classList.contains("show")) closeFormModal();
  }
});

searchInput.addEventListener("input", function (e) {
  searchQuery = e.target.value.trim();
  renderList();
});

document.querySelectorAll(".fbtn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".fbtn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderList();
  });
});

document.querySelectorAll(".tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    currentSubject = tab.getAttribute("data-subject");
    renderList();
  });
});

initFirebase();
