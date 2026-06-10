export default function NavbarGreen() {
  return (
    <header className="bg-success text-white py-3 shadow-sm border-bottom border-light">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span className="fs-3 me-2"></span>
          <h2 className="mb-0 fw-bold h4">GreenTech Fert</h2>
        </div>
        <div className="d-none d-md-block">
          <span className="badge rounded-pill bg-light text-success px-3 py-2">
            Portal de Insumos - v1.0
          </span>
        </div>

      </div>
    </header>
  );
}