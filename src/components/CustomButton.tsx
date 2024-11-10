import './CustomButton.scss'

interface CustomButtonProps {
  color?: 'base' | 'primary' | 'accent'
  type?: 'button' | 'submit'
  text: string
  action?: () => void
}

function CustomButton ({ type = 'button', color = 'primary', text, action }: CustomButtonProps) {
  return (
    <button type={type} className={`${color} custom-button`} onClick={action}>
      {text}
    </button>
  )
}

export default CustomButton
