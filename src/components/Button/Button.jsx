import './Button.css'

function Button({onClick, text, variant = 'save' }) {
  return (
    <button
        className={`btn btn-${variant}`}        
        onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;