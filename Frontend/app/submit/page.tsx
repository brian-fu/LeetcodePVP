// path: app/submit/page.tsx
import SubmitForm from '../components/SubmitForm';

const SubmitPage = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#0d0d0d",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px", color: "#ffffff" }}>Submit Your Solution</h1>
      <SubmitForm />
    </div>
  );
};

export default SubmitPage;