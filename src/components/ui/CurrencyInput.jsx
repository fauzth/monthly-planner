export default function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  ...props
}) {
  const display = value ? new Intl.NumberFormat("id-ID").format(value) : "";

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    onChange(digits ? Number(digits) : 0);
  };

  return (
    <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-emerald-500">
      <span className="text-gray-500">Rp</span>
      <input
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent p-3 outline-none"
        {...props}
      />
    </div>
  );
}
