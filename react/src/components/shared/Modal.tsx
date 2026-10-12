import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ModalProps {
    title: any;
    children: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    className?: string;
    dismissible?: boolean;
}

export default function Modal({ title, children, open, setOpen, className = "", dismissible = true }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={className}
                onPointerDownOutside={(e) => {
                    if (!dismissible) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (!dismissible) {
                        e.preventDefault();
                    }
                }}
                showCloseButton={dismissible}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    );
}
