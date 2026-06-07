import { useState } from "react";

export default function useSelection() {
    const [selectedId, setSelectedId] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(null);
    const [resizing, setResizing] = useState(false);
    return {
        selectedId,
        setSelectedId,
        dragging,
        setDragging,
        dragOffset,
        setDragOffset,
        resizing,
        setResizing
    };
}