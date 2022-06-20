import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./configCategory.scss";
import "./mypages.scss";

import { TbEqual } from "react-icons/tb";
import { FaEdit, FaTrashAlt, FaPlus, FaCheck } from "react-icons/fa";

import config from "../../../config/config.json";

interface item {
    Category: string;
    isNew: boolean;
    existingCategory?: string;
    isInEdit: boolean;
}

const ConfigCategory = () => {
    const [itemList, setItemList] = useState([] as item[]);
    const [deletedCategory, setDeletedCategory] = useState([] as string[]);

    const [activeNewItem, setActiveNewItem] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    const newItemRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const editRefs = useRef(new Array(itemList.length));

    const newItemEvent = (e: any) => {
        if (e.key === "Enter") {
            addCategory();
        } else if (e.key === "Escape") {
            setActiveNewItem(false);
        }
    };

    const addCategory = async () => {
        let item = newItemRef.current.value;
        if (item !== "") {
            if (itemList.filter((i) => i.Category === item).length !== 0) {
                alert("동일한 카테고리가 존재합니다.");
                newItemRef.current.focus();
                return;
            }
            await setItemList([
                ...itemList,
                {
                    Category: item,
                    isNew: true,
                    isInEdit: false,
                },
            ]);
            newItemRef.current.value = "";
            setActiveNewItem(false);
        } else {
            alert("카테고리를 입력해주세요.");
            newItemRef.current.focus();
            return;
        }
    };

    const setEdit = async (index: number) => {
        let temp = [...itemList];
        temp[index] = { ...temp[index], isInEdit: true };
        await setItemList(temp);
        editRefs.current[index].focus();
    };

    const editCategory = async (index: number) => {
        let value = editRefs.current[index].value;

        if (value.trim().length === 0) {
            alert("카테고리를 입력해주세요");
            editRefs.current[index].focus();
            return;
        } else if (value.length > 100) {
            alert("카테고리는 최대 100자까지만 입력 가능합니다.");
            editRefs.current[index].focus();
            return;
        } else {
            let temp = [...itemList];
            temp[index] = { ...temp[index], isInEdit: false, Category: value };
            await setItemList(temp);
        }
    };

    const deleteCategory = async (item: item) => {
        if (item.isNew) {
            setItemList([
                ...itemList.filter((i) => i.Category !== item.Category),
            ]);
        } else {
            if (
                window.confirm(
                    `'${item.Category}' 카테고리에 포함된 게시글은 모두 삭제됩니다.\n정말로 삭제하시겠습니까?`
                )
            ) {
                setItemList([
                    ...itemList.filter((i) => i.Category !== item.Category),
                ]);
                setDeletedCategory([...deletedCategory, item.Category]);
            } else {
                return;
            }
        }
    };

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
            let temp = [] as item[];
            result.data.body.Categories.map(
                (category: string, index: number) => {
                    temp = [
                        ...temp,
                        {
                            Category: category,
                            isNew: false,
                            existingCategory: category,
                            isInEdit: false,
                        } as item,
                    ];
                }
            );
            setItemList(temp);
        }
    };

    const setCategories = async () => {
        try {
            let data = {
                userkey: sessionStorage.getItem("UserKey"),
                deletedCategory: [...deletedCategory],
                Categories: [...itemList],
            };
            let result = await axios.put(
                `${config.baseurl}/member/setCategories`,
                data,
                { headers: { Authorization: config.apikey } }
            );
            if (result.status === 200) {
                alert("카테고리 설정이 완료되었습니다.");
                window.location.href = "/mypage/configCategory";
            }
        } catch (err) {
            alert("문제가 발생했습니다.\n잠시 후 다시 시도해주세요.");
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
                    <p>카테고리 목록</p>
                    {itemList.length === 0 ? (
                        <div className="no-item">카테고리 없음</div>
                    ) : (
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
                                                key={item.Category}
                                                draggableId={item.Category}
                                                index={index}
                                            >
                                                {(provided: any) => (
                                                    <div
                                                        className="item-container"
                                                        {...provided.draggableProps}
                                                    >
                                                        <div className="item-container-left">
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <TbEqual />
                                                            </div>
                                                            {item.isInEdit ? (
                                                                <input
                                                                    type="text"
                                                                    className="edit-input"
                                                                    defaultValue={
                                                                        item.Category
                                                                    }
                                                                    ref={(el) =>
                                                                        (editRefs.current[
                                                                            index
                                                                        ] = el)
                                                                    }
                                                                    onBlur={() =>
                                                                        editCategory(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <p
                                                                    onClick={() =>
                                                                        setEdit(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        item.Category
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="item-container-right">
                                                            {item.isInEdit ? (
                                                                <FaCheck
                                                                    className="icon"
                                                                    onClick={() =>
                                                                        editCategory(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <>
                                                                    <FaEdit
                                                                        className="icon"
                                                                        onClick={() => {
                                                                            setEdit(
                                                                                index
                                                                            );
                                                                        }}
                                                                    />
                                                                    <FaTrashAlt
                                                                        className="icon"
                                                                        onClick={() =>
                                                                            deleteCategory(
                                                                                item
                                                                            )
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                    <div className="new-item">
                        {activeNewItem && (
                            <div className="new-item-container">
                                <input
                                    type="text"
                                    className="new-item-input"
                                    ref={newItemRef}
                                />
                                <FaCheck
                                    className="new-item-check"
                                    onClick={() => addCategory()}
                                />
                            </div>
                        )}
                        <div
                            className="item-add-btn"
                            onClick={async () => {
                                await setActiveNewItem(true);
                                newItemRef.current.addEventListener(
                                    "keydown",
                                    newItemEvent
                                );
                                newItemRef.current.focus();
                            }}
                        >
                            <FaPlus />
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <input
                            type="button"
                            value="취소"
                            onClick={() =>
                                (window.location.href = "/mypage/configBlog")
                            }
                        />
                        <input
                            type="button"
                            value="저장"
                            onClick={() => setCategories()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigCategory;
