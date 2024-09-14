import { DndContext } from "@dnd-kit/core";
import Droppable from "./DnD/Droppable";
import Draggable from "./DnD/Draggable";
import { Fragment } from "react/jsx-runtime";

export default function OrganizeLayer({layer, setOrganization, organization, index}: any) {

    return (
        <DndContext onDragEnd={event => handleDragEnd(event, index)}>
                <div className='flex flex-row' style={{gap: `${index*2}rem`}}>
                    {layer.map((player: any, index: number) => (
                        <Fragment key={player+index}>
                        <Droppable id={player}>
                            <Draggable className={`text-white bg-gray-900 p-1 min-w-[100px]`} id={layer[index]}>{layer[index]}</Draggable>
                        </Droppable>
                        { layer.length === 2 && index % 2 === 0 ||( index < layer.length - 1 && index % 2 === 0 ) ?
                        <div className='text-white p-2 min-w-[20px]'>
                            Vs.
                        </div>
                        :
                        index < layer.length - 1 &&
                        <div className='text-white p-2 min-w-[20px]'>
                            &nbsp;
                        </div>
                        }
                        </Fragment>
                ))}
                </div>
        </DndContext>
    );

    function handleDragEnd(event: any, index: number) {
        console.log(event);
        if (event.over) {
            const activeId = event.active.id;
            const overId = event.over.id;

            // Find the index of the active and over elements
            const activeIndex = organization[index].indexOf(activeId);
            const overIndex = organization[index].indexOf(overId);

            // Swap the items in the organization array
            if (activeIndex !== -1 && overIndex !== -1) {
                const updatedOrganization = [...organization];
                const temp = updatedOrganization[index][activeIndex];
                updatedOrganization[index][activeIndex] = updatedOrganization[index][overIndex];
                updatedOrganization[index][overIndex] = temp;

                setOrganization(updatedOrganization);
            }
        }
    }
}