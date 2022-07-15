import React, { useCallback, useMemo } from "react";

interface IMenuButton {
    options: string[];
    selectedValue: string;
    onValueSelected: (value: string) => void;
    name: string;
}

const MenuButton: React.FC<IMenuButton> = ({ name, options, selectedValue, onValueSelected }) => {

    const handleButtonClicked = useCallback((value: string) => () => {
        onValueSelected(value);
    }, [onValueSelected]);

    const renderButton = useCallback((item: string, index: number) => {
        const customClass = item == selectedValue ? 'bg-[#000000] text-[#ffffff]' : '';
        return (
            <button
                className={`w-1/3 h-[48px] cursor-pointer text-[13px] border-[2px] border-[#8F8F8F] mb-[0.5rem] rounded-[12px] truncate p-[0.5rem] ${customClass}`}
                key={`${name}-${index + 1}`}
                onClick={handleButtonClicked(item)}
                style={{ width: 'calc(33.33% - 0.3333rem)' }}
            >
                {item}
            </button>
        )
    }, [selectedValue, handleButtonClicked, name])

    return (
        <div className="w-full flex flex-row flex-wrap mt-[0.5rem] justify-between">
            {options.map(renderButton)}
        </div >
    )
}

export default MenuButton;
