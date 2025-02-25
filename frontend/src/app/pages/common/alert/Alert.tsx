interface AlertProps {
  message: string;
  type: "success" | "danger" | "warning";
}

export function Alert({ message, type }: AlertProps) {
  return (
    <div
      className={`mb-lg-15 alert alert-${type} position-fixed end-0 m-3 shadow-lg`}
      style={{ top: "10%", zIndex: 9999, minWidth: "250px" }}
    >
      <div className="alert-text font-weight-bold">{message}</div>
    </div>
  );
}
