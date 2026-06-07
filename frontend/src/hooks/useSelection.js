import { useState } from "react";

export default function useSelection() {
    const [selectedId, setSelectedId] = useState(null);
    const [dragging, setDragging] = useState(false);

    return {
        selectedId,
        setSelectedId,
        dragging,
        setDragging
    };
}