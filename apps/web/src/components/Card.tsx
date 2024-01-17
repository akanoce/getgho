type Props = {
    children: React.ReactNode;
    additionalClasses?: string;
};
export const Card: React.FC<Props> = ({ children, additionalClasses = '' }) => {
    return (
        <div
            className={`p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 flex flex-col  gap-y-2 ${additionalClasses}`}
        >
            {children}
        </div>
    );
};
