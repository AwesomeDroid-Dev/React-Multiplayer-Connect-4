import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

function Draggable(props: { className: string; id: string; children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
    });
    // Within your component that receives `transform` from `useDraggable`:
    const style = {
        transform: CSS.Translate.toString(transform),
    }
  
    return (
        <button ref={setNodeRef} className={props.className} style={style} {...listeners} {...attributes}>
        {props.children}
        </button>
    );
}

export default Draggable