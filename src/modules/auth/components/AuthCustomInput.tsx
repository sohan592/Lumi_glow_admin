import { useState } from "react";
import "./style.scss";

type AuthCustomInputProps = {
    type?: 'text' | 'password' | 'number';
    placeholder?: string;
  };

const AuthCustomInput :React.FC<AuthCustomInputProps> = ({ type, placeholder }) => {

    const [showPassWord, setShowPassword] = useState(false)

    const TYPE_PASSWORD = "password";
    const TYPE_TEXT = "text";

    const toggleShowHidePassword = () => { setShowPassword(!showPassWord) }

    const eyeOpenCloseIcon =
        showPassWord
            ?

            <i className="ri-eye-off-line" />
            :
            <i className="ri-eye-line" />
    return (
        <>
            <div className="form-group">
                {
                    type === TYPE_PASSWORD
                        ?
                        <input
                            className="form-input"
                            type={showPassWord ? TYPE_TEXT : TYPE_PASSWORD}
                            required />
                        :
                        <input
                            className="form-input"
                            type={type}
                            required />
                }

                <label className="auth-label">
                    {placeholder}
                </label>
                {
                    type === TYPE_PASSWORD
                    &&
                    <div
                        className="password-icon"
                        onClick={toggleShowHidePassword}>
                        {eyeOpenCloseIcon}
                    </div>
                }

            </div>
        </>
    );
};

export default AuthCustomInput;