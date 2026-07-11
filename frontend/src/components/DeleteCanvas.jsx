import { motion } from "framer-motion";
import Button from "./common/Button";

const DeleteCanvas = ({ open, onCancel, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-surface border border-border rounded-2xl p-8 w-full max-w-[420px]"
            >
                <h2 className="text-2xl font-bold mb-3 text-white">
                    Clear Whiteboard?
                </h2>

                <p className="text-muted mb-8">
                    This will permanently remove all drawings for everyone in
                    the room. This action cannot be undone.
                </p>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-700 hover:bg-gray-600"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        Clear
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteCanvas;