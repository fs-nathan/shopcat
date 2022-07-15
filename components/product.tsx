/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addToCart, fetchProductById, IProduct } from "./utils";
import { isEmpty, get, maxBy, isNumber } from "lodash";
import MenuButton from "./menu-button";
import Loader from "./loader";

const ProductComponent: React.FC = () => {

    const [product, setProduct] = useState<IProduct>({} as IProduct);
    const [selectedOptions, setSelectedOptions] = useState({ one: '', two: '' });
    const [isLoading, setLoading] = useState(false);

    const { options, variants, variantRewards, imageSrc, description } = useMemo(() => {
        let data, variantRewards;
        if (!isEmpty(product) && !isEmpty(product.data)) {
            data = JSON.parse(product.data)
        }
        if (!isEmpty(product) && !isEmpty(product.variantRewards)) {
            variantRewards = JSON.parse(product.variantRewards)
        }
        return { options: data?.options, variants: data?.variants, imageSrc: data?.image.src, description: data?.body_html, variantRewards };
    }, [product]);

    const foundVariant = useMemo(() => {
        if (isEmpty(variants)) return {};
        const found = variants.find((item: any) => item.option1 == selectedOptions.one && item.option2 == selectedOptions.two);
        return found;
    }, [variants, selectedOptions]);

    const reward = useMemo(() => {
        if (isEmpty(foundVariant) || isEmpty(variantRewards)) return 0;
        return variantRewards[foundVariant.id] || 0;
    }, [foundVariant, variantRewards]);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const result = await fetchProductById();
                if (result) {
                    setProduct(result);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProductData();
    }, []);

    const handleOptionChanged = useCallback((prop: 'one' | 'two') => (value: string) => {
        setSelectedOptions(option => {
            const newOption = { ...option };
            newOption[prop] = value
            return newOption;
        })
    }, []);

    const handleSubmit = useCallback(() => {
        if (foundVariant) {
            const addVariant = async () => {
                setLoading(true);
                try {
                    const result = await addToCart(foundVariant.id);
                    if (get(result, 'data.addToCart', false)) {
                        alert('Succeeded');
                    }
                } catch (e) {
                    console.log(e);
                    alert('Failed');
                } finally {
                    setLoading(false);
                }
            }
            addVariant();
        }
    }, [foundVariant]);

    useEffect(() => {
        // pre-select highest rewarded variant
        if (isEmpty(variantRewards) || isEmpty(variants)) return;
        const rewards = Object.keys(variantRewards).map(item => { return { variantId: item, point: variantRewards[item] } })
        const maxReward = maxBy(rewards, 'point');
        if (!isEmpty(maxReward)) {
            const variant = variants.find((item: any) => item.id == maxReward?.variantId)
            if (!isEmpty(variant)) {
                setSelectedOptions({ one: variant.option1, two: variant.option2 })
            }
        }
    }, [variantRewards, variants]);

    return (
        <div className="h-full bg-gray-400 mobile:w-full non-mobile:w-[480px] overflow-y-auto">
            <div id="header" className="bg-linen w-full h-[6rem] pt-[1rem] pb-[2.5rem] px-[1rem] rounded-b-[14px]">
                <div className="flex flex-row justify-between">
                    <span>{product.name || ''}</span>
                    <span className="text-safety-orange text-[20px]">{!isEmpty(foundVariant) && !isEmpty(foundVariant.price) ? `$${Number(`${foundVariant.price}`).toFixed(2)}` : 'Variant Unavailable'}</span>
                </div>
                <div className="flex flex-row justify-end">
                    {reward > 0 && (
                        <p className="text-black text-[13px]">You got: <span className="text-sea-buckthorn">{`$${Number(reward).toFixed(2)}`}</span></p>
                    )}
                </div>
            </div>

            {!isLoading && <div id="content" className="w-full pt-[1rem] px-[4rem] justify-center flex flex-col">
                <div className="w-full h-full flex flex-col">
                    {!isEmpty(imageSrc) && (
                        <div className="w-full h-auto flex justify-center">
                            <img
                                className="w-auto h-[150px]"
                                src={imageSrc}
                                alt={product.name}
                            />
                        </div>
                    )}
                    <span className="mt-[1.5rem] text-[17px]">{product.name || ''}</span>
                    <div className="text-heavy-gray text-[13px] mt-[0.5rem]" dangerouslySetInnerHTML={{ __html: description }} />

                    {!isEmpty(options) && !isEmpty(options[0]) && (
                        <>
                            <span className="mt-[1.5rem] text-[17px] text-heavy-gray">{options[0]['name']}</span>
                            <MenuButton
                                name={options[0]['name']}
                                options={options[0].values}
                                selectedValue={selectedOptions.one}
                                onValueSelected={handleOptionChanged('one')}
                            />
                        </>
                    )}

                    {!isEmpty(options) && !isEmpty(options[1]) && (
                        <>
                            <span className="mt-[1.5rem] text-[17px] text-heavy-gray">{options[1]['name']}</span>
                            <MenuButton
                                name={options[1]['name']}
                                options={options[1].values}
                                selectedValue={selectedOptions.two}
                                onValueSelected={handleOptionChanged('two')}
                            />
                        </>
                    )}

                    {(
                        <div className="w-full flex justify-center my-[1.5rem]">
                            <button
                                className={`w-full h-[48px] bg-safety-orange cursor-pointer text-[15px] text-[#ffffff] mb-[0.5rem] rounded-[12px] truncate p-[0.5rem] disabled:bg-linen disabled:cursor-default`}
                                onClick={handleSubmit}
                                disabled={isEmpty(foundVariant) || isLoading}
                            >
                                Add to My Store
                            </button>
                        </div>
                    )}

                </div>
            </div>
            }
            {isLoading && <Loader />}
        </div>
    )
}

export default ProductComponent;
