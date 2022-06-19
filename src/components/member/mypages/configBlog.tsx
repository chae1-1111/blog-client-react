import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./configBlog.scss";
import "./mypages.scss";

import config from "../../../config/config.json";

const ConfigBlog = () => {
    const [itemList, setItemList] = useState([] as string[]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const result = await axios.get(
            `${
                config.baseurl
            }/member/getCategories?userkey=${sessionStorage.getItem(
                "UserKey"
            )}`,
            { headers: { Authorization: config.apikey } }
        );
        if (result.status === 200) {
            setItemList(result.data.body.Categories);
        }
    };

    const handleDrop = (droppedItem: any) => {
        if (!droppedItem.destination) return;
        var updatedList = [...itemList];
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        setItemList(updatedList);
    };

    return (
        <div>
            <h1>카테고리 설정</h1>
            <div className="sub-content-wrap">
                <div className="sub-content configBlog">
                    <DragDropContext onDragEnd={handleDrop}>
                        <Droppable droppableId="list-container">
                            {(provided) => (
                                <div
                                    className="list-container"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {itemList.map((item, index) => (
                                        <Draggable
                                            key={item}
                                            draggableId={item}
                                            index={index}
                                        >
                                            {(provided: any) => (
                                                <div
                                                    className="item-container"
                                                    {...provided.draggableProps}
                                                >
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        =
                                                    </div>
                                                    {item}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
};

export default ConfigBlog;
