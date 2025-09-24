import { createContext, useContext, useState } from "react";

const ModalContext = createContext();


export function ModalProvider ({children }){
    const [activeModal, setActiveModal] = useState();
    
    const openModal= (name) => setActiveModal(name);
    const closeModal = () => setActiveModal ("");

    return (
         <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
    );
}

export function useModal() {
  return useContext(ModalContext);
}