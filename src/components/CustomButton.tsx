import './CustomButton.scss'

interface CustomButtonProps {
  type?: 'button' | 'submit'
  text: string
  action?: () => void
}

function CustomButton({ type = 'button', text , action }: CustomButtonProps) {
  return (
    <button type={type} className="custom-button" onClick={action}>
      {text}
    </button>
  )
}

export default CustomButton