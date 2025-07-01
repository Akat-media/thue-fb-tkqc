import { ChevronRight } from "lucide-react"; // hoặc icon bạn đang dùng

type ArrowProps = {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
};

const CustomNextArrow: React.FC<ArrowProps> = ({ onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 bg-white rounded-lg border border-gray-300 shadow hover:shadow-md transition button-hover absolute top-1/2 right-2 -translate-y-1/2 z-10 ${className}`}
        >
            <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
    );
};

export default CustomNextArrow;
