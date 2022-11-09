import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const formClasses =
  'block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-semibold text-gray-900"
    >
      {children}
    </label>
  )
}

function FormLabel({ id, isValid, isFocused = false, children }) {
  return (
    <div className="flex items-center mb-1 items">
      <label
        htmlFor={id}
        className="p-1 mr-2 text-sm font-semibold text-gray-900 "
      >
        {children}
      </label>
      {isFocused ? (
        isValid ? (
          <FontAwesomeIcon icon={faCheck} className="text-green-400" />
        ) : (
          <FontAwesomeIcon icon={faTimes} className="text-red-500" />
        )
      ) : null}
    </div>
  )
}

export function TextField({ id, label, type = 'text', className, ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function FormTextField({
  id,
  label,
  isValid,
  isFocused,
  type = 'text',
  className,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <FormLabel id={id} isValid={isValid} isFocused={isFocused}>
          {label}
        </FormLabel>
      )}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}
