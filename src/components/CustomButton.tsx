import './CustomButton.scss'

interface CustomButtonProps {
  color?: 'base' | 'primary' | 'accent'
  type?: 'button' | 'submit'
  text: string
  action?: () => void
  disabled?: boolean
}

export function CustomButton ({ type = 'button', color = 'primary', text, action, disabled }: CustomButtonProps) {
  return (
    <button type={type} className={`${color} custom-button`} onClick={action} disabled={disabled}>
      {text}
    </button>
  )
}
