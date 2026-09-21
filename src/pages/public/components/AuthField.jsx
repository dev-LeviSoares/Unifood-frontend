/**
 * Campo de formulário usado pelas telas públicas de autenticação/cadastro
 * (Login, StudentRegister, SellerRegister). Antes existia uma cópia quase
 * idêntica desse componente dentro de cada arquivo — com assinaturas
 * ligeiramente diferentes (`onChange` vs `update`), o que já tinha começado
 * a divergir. Centralizado aqui, com uma única assinatura.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.label
 * @param {string} [props.type='text']
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.autoComplete]
 */
export function AuthField({ id, label, type = 'text', value, onChange, autoComplete }) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
