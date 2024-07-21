
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const logoff = () => {
    toast.success("Desconectado com sucesso!")
    Cookies.remove("token")
    window.location.href = "/";
  }