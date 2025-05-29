import { TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-md shadow-lg px-4 py-3">
                <p className="text-blue-800 font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-800">
                        <span
                            className="w-3 h-3 inline-block rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="font-medium">
                          {entry.name}: <span className="text-blue-900">{Number(entry.value).toLocaleString()}.000</span>
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};


export default CustomTooltip;
