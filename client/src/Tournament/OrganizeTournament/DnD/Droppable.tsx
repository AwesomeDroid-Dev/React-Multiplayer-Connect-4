import {useDroppable} from '@dnd-kit/core';

function Droppable(props: { id: string; children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    backgroundColor: isOver ? 'green' : 'gray',
    padding: '0.25rem',
  };
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export default Droppable