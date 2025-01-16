import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ResetPasswordModal() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  async function sendEmail(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/forgot-password",
        { email }
      );
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (e) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/reset-password/" + code,
        {
          new_password: password,
        }
      );
      toast.success("Password changed successfully!");
      onCloseModal();
      setOpenModal(false);
    } catch (e) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
    setPassword("");
    setCode("");
  }
  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
      >
        Forgot password?
      </button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Reset Your Password
            </h3>
            {emailSent ? (
              <>
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="code" value="Enter code" />
                  </div>
                  <TextInput
                    color="blue"
                    id="code"
                    placeholder="Enter code you received in email"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="password" value="New Password" />
                  </div>
                  <TextInput
                    color="blue"
                    id="password"
                    placeholder="*****"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                  <Button
                    onClick={resetPassword}
                    color="blue"
                    isProcessing={loading}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Resetting" : "Reset password"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="email" value="Your email" />
                  </div>
                  <TextInput
                    color="blue"
                    id="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                  <Button
                    onClick={sendEmail}
                    color="blue"
                    isProcessing={loading}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
