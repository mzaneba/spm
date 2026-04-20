const AKUN = [
  {
    id: "u1",
    username: "user1",
    password: "user123",
    role: "user",
  },
  {
    id: "u2",
    username: "user2",
    password: "user223",
    role: "user",
  },
  {
    id: "u3",
    username: "user3",
    password: "user323",
    role: "user",
  },
  {
    id: "a1",
    username: "admin1",
    password: "admin123",
    role: "admin",
  },
  {
    id: "a2",
    username: "admin2",
    password: "admin223",
    role: "admin",
  },
  {
    id: "a3",
    username: "admin3",
    password: "admin323",
    role: "admin",
  },
];

function getLaporan() {
  return JSON.parse(localStorage.getItem("spm_laporan") || "[]");
}
function saveLaporan(data) {
  localStorage.setItem("spm_laporan", JSON.stringify(data));
}
function getSession() {
  return JSON.parse(localStorage.getItem("spm_session") || "null");
}
function setSession(akun) {
  localStorage.setItem("spm_session", JSON.stringify(akun));
}
function clearSession() {
  localStorage.removeItem("spm_session");
}

function requireLogin(role) {
  const s = getSession();
  if (!s) {
    location.href = "login.html";
    return null;
  }
  if (role && s.role !== role) {
    location.href = "login.html";
    return null;
  }
  return s;
}

function doLogin(username, password) {
  const akun = AKUN.find(
    (a) => a.username === username && a.password === password,
  );
  if (!akun) return null;
  const { password: _, ...safe } = akun;
  setSession(safe);
  return safe;
}

function buatLaporan(user, data) {
  const semua = getLaporan();
  const id = "ADU-" + Math.floor(10000 + Math.random() * 90000);
  const now = tanggalSekarang();
  const laporan = {
    id,
    userId: user.id,
    namaPelapor: data.namaPelapor,
    telepon: data.telepon,
    username: user.username,
    kategori: data.kategori,
    lokasi: data.lokasi,
    judul: data.judul,
    deskripsi: data.deskripsi,
    tanggal: now,
    status: "Diterima",
    respon: "",
    log: [{ status: "Diterima", waktu: now, catatan: "Laporan masuk" }],
  };
  semua.push(laporan);
  saveLaporan(semua);
  return laporan;
}

function updateStatus(id, statusBaru, catatan) {
  const semua = getLaporan();
  const idx = semua.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  semua[idx].status = statusBaru;
  semua[idx].respon = catatan;
  semua[idx].log.push({
    status: statusBaru,
    waktu: tanggalSekarang(),
    catatan,
  });
  saveLaporan(semua);
  return true;
}

function editLog(id, idx, statusBaru, catatan) {
  const semua = getLaporan();
  const lap = semua.find((l) => l.id === id);
  if (!lap || !lap.log[idx]) return false;
  lap.log[idx].status = statusBaru;
  lap.log[idx].catatan = catatan;
  lap.status = lap.log[lap.log.length - 1].status;
  lap.respon = lap.log[lap.log.length - 1].catatan;
  saveLaporan(semua);
  return true;
}

function hapusLog(id, idx) {
  const semua = getLaporan();
  const lap = semua.find((l) => l.id === id);
  if (!lap || idx === 0 || !lap.log[idx]) return false;
  lap.log.splice(idx, 1);
  lap.status = lap.log[lap.log.length - 1].status;
  lap.respon = lap.log[lap.log.length - 1].catatan;
  saveLaporan(semua);
  return true;
}

function tanggalSekarang() {
  return new Date().toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function badgeStatus(status) {
  const map = {
    Diterima: "badge-diterima",
    Diproses: "badge-diproses",
    Ditindaklanjuti: "badge-lanjut",
    Selesai: "badge-selesai",
    Ditolak: "badge-tolak",
  };
  return `<span class="badge ${map[status] || ""}">${status}</span>`;
}
