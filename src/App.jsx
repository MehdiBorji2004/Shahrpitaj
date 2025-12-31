import { StrictMode } from "react";
import AppRoutes from "./routes/AppRoutes";

// export const reserveTimes = createContext();

const App = () => {
  return (
    <>
      <StrictMode>
        <AppRoutes />
      </StrictMode>
    </>
  );
};

export default App;
