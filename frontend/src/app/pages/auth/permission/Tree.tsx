import { useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";

interface TreeProps {
  id: string;
  title: string;
  children?: React.ReactNode;
}

export function Tree({ id, title, children }: TreeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5">
      <div className="accordion-header py-3 d-flex" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
        <span className="accordion-icon">
          <KTIcon iconName={isOpen ? "element-11" : "element-10"} className="fs-1 text-gray-800"/>
        </span>
        <h3 className="fs-4 text-gray-800 fw-bold mb-0 ms-4">{title}</h3>
      </div>

      <div className={`fs-6 collapse ${isOpen ? "show" : ""}`} id={id}>
        <div className="ps-10">{children}</div>
      </div>
    </div>
  );
}
