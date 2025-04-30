export default function ProfileField({ label, name, value, readOnly, id, onChange, type, children, labelClassName, inputClassName,required }) {
    return (
        <div className="flex flex-row justify-center items-center ">
            <div className="flex flex-row ml-4 w-full items-center border-b-2 space-x-6 ">
                <label htmlFor={id} className={labelClassName}>{label}</label>
                {type && <input
                    type={type}
                    name={name}
                    id={id}
                    value={value || ""}
                    onChange={onChange}
                    readOnly={readOnly}
                    className={inputClassName}
                    required={required}
                />}
                {children && <div className="ml-2">{children}</div>}
            </div>
        </div>
    );
}
