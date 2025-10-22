import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";
import Button from "../Button";
import { CgClose } from "react-icons/cg";

const AddNewEmployeeModal = ({ isOpen, setIsOpen, formik, children }) => {
  function close() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-20 focus:outline-none"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-20 w-screen overflow-hidden">
        <div className="flex min-h-full items-center justify-end p-4">
          <DialogPanel
            transition
            className="w-full h-[calc(100vh-32px)] max-w-md overflow-auto rounded-xl bg-white backdrop-blur-2xl duration-200 ease-out data-[closed]:translate-x-full data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between py-4 px-5 border-b border-solid border-gray-200 dark:border-gray-800">
              <DialogTitle as="h4" className="">
                Add Employee
              </DialogTitle>
              <button
                onClick={() => {
                  close();
                  formik.resetForm();
                  setEditable(false);
                }}
              >
                <CgClose fontSize={24} />
              </button>
            </div>
            <div className="p-5 h-[calc(100%-142px)] overflow-auto">
              {children}
            </div>
            <div className="px-4 py-3.5 grid grid-cols-2 gap-3 border-t border-solid border-gray-200 dark:border-gray-">
              <Button
                variant="primary"
                type="submit"
                onClick={() => {
                  formik.submitForm();
                  close();
                }}
              >
                Add
              </Button>
              <Button
                variant="white"
                onClick={() => {
                  close();
                  formik.resetForm();
                  setEditable(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddNewEmployeeModal;
