import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

export default function DataSiswa() {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/siswa")
      .then(res => {
        setSiswa(res.data);
      })
      .catch(err => {
        console.error("Gagal memuat data:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      kode_siswa: kode,
      nama_siswa: nama,
      alamat,
      tanggal_lahir: tanggalLahir,
      jurusan,
    };

    const req = editId
      ? axios.put(`http://localhost:5000/api/siswa/${editId}`, data)
      : axios.post("http://localhost:5000/api/siswa", data);

    req.then(() => {
      alert(editId ? "Siswa berhasil diperbarui!" : "Siswa berhasil ditambahkan!");
      fetchData();
      resetForm();
    })
      .catch(err => {
        console.error("Gagal menyimpan siswa:", err);
        alert("Terjadi kesalahan saat menyimpan data.");
      })
      .finally(() => {
        const modalEl = document.getElementById("modalSiswa");
        const modal = Modal.getOrCreateInstance(modalEl);
        modal.hide();
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach(bd => bd.remove());
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Anda yakin akan menghapus siswa ini?")) return;
    axios.delete(`http://localhost:5000/api/siswa/${id}`)
      .then(() => {
        alert("Siswa berhasil dihapus!");
        fetchData();
      })
      .catch(err => {
        console.error("Gagal menghapus siswa:", err);
      });
  };

  const handleEdit = (item) => {
    setEditId(item.kode_siswa);
    setKode(item.kode_siswa);
    setNama(item.nama_siswa);
    setAlamat(item.alamat);
    setTanggalLahir(item.tanggal_lahir ? item.tanggal_lahir.slice(0, 10) : "");
    setJurusan(item.jurusan);

    const modalEl = document.getElementById("modalSiswa");
    const modal = Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  const resetForm = () => {
    setEditId(null);
    setKode("");
    setNama("");
    setAlamat("");
    setTanggalLahir("");
    setJurusan("");
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <>
      {/* FULL WRAPPER BACKGROUND */}
      <div 
        style={{ 
          background: "linear-gradient(to bottom, #876cfdff, #46a4b4ff)", 
          minHeight: "100vh",
          paddingTop: "50px",
          paddingBottom: "50px"
        }}
      >
        {/* KONTEN */}
        <div className="container">
          <h2 className="text-center mb-4">Data Siswa</h2>

          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#modalSiswa"
              onClick={resetForm}
            >
              Tambah Siswa
            </button>
          </div>

          <table className="table table-bordered table-secondary table-striped text-center align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Kode Siswa</th>
                <th>Nama Siswa</th>
                <th>Alamat Siswa</th>
                <th>Tanggal Lahir</th>
                <th>Jurusan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswa.length > 0 ? siswa.map((s, i) => (
                <tr key={i}>
                  <td>{s.kode_siswa}</td>
                  <td>{s.nama_siswa}</td>
                  <td>{s.alamat}</td>
                  <td>{new Date(s.tanggal_lahir).toLocaleDateString()}</td>
                  <td>{s.jurusan}</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button className="btn btn-warning btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.kode_siswa)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">Belum ada data siswa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="modalSiswa" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editId ? "Edit Siswa" : "Tambah Siswa"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                
                {!editId && (
                  <div className="form-floating mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Kode Siswa"
                      value={kode}
                      onChange={e => setKode(e.target.value)}
                      required
                    />
                    <label>Kode Siswa</label>
                  </div>
                )}

                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Siswa"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    required
                  />
                  <label>Nama Siswa</label>
                </div>

                <div className="form-floating mb-2">
                  <textarea
                    className="form-control"
                    style={{ height: "80px" }}
                    placeholder="Alamat"
                    value={alamat}
                    onChange={e => setAlamat(e.target.value)}
                    required
                  ></textarea>
                  <label>Alamat</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    type="date"
                    className="form-control"
                    value={tanggalLahir}
                    onChange={e => setTanggalLahir(e.target.value)}
                    required
                  />
                  <label>Tanggal Lahir</label>
                </div>

                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    value={jurusan}
                    onChange={(e) => setJurusan(e.target.value)}
                    required
                  >
                    <option value="" disabled>Pilih Jurusan</option>
                    <option value="IPA">IPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="TKJ">TKJ</option>
                    <option value="RPL">RPL</option>
                  </select>
                  <label>Jurusan</label>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  {editId ? "Simpan Perubahan" : "Simpan"}
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
