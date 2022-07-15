import React, { useEffect, useMemo, useState } from "react";
import { fetchProductById, IProduct } from "../utils";
import { isEmpty, get } from "lodash";

const ProductComponent: React.FC = () => {

    const [product, setProduct] = useState<IProduct>({} as IProduct);
    const [selectedOptions, setSelectedOptions] = useState({ one: '', two: '' });
    const [isLoading, setLoading] = useState(false);

    const { options, variants, variantRewards } = useMemo(() => {
        let data, variantRewards;
        if (!isEmpty(product) && !isEmpty(product.data)) {
            data = JSON.parse(product.data)
        }
        if (!isEmpty(product) && !isEmpty(product.variantRewards)) {
            variantRewards = JSON.parse(product.variantRewards)
        }
        return { options: data?.options, variants: data?.variants, variantRewards };
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

    useEffect(() => {
        console.log(options, variants, variantRewards);
    }, [options, variants, variantRewards]);

    return (
        <div>Product</div>
    )
}

export default ProductComponent;
