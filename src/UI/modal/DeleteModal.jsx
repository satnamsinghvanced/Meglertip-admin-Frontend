import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";
import Button from "../Button";

const DeleteModal = ({ isOpen, setIsOpen, deleteAction }) => {
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
      <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-8 backdrop-blur-2xl text-center duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="">
              Are you sure?
            </DialogTitle>
            <p className="mt-4 text-base/7">
              Are you sure you want to delete this record? We will store this
              record in our servers in case you change your mind.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="transparent" size="sm" onClick={close}>
                Cancel
              </Button>
              <Button size="sm" onClick={deleteAction}>
                Delete
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteModal;
