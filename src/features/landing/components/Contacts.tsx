"use client";

// import axios from "axios";
import { ExternalLink, SendHorizonal } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button, Form } from "react-aria-components";
import { CustomTextArea } from "@/components/ui/CustomTextArea";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useEnv } from "@/env/provider";

const SuccessMessage = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="absolute z-50 inset-0 flex items-center justify-center"
  >
    <div className="flex flex-col gap-4 backdrop-blur-2xl p-6 border border-border rounded-sm">
      <p className="font-bold text-lg">Обращение успешно отправлено!</p>
      <p className="text-sm opacity-50">
        Один из наших сотрудников свяжется с вами в ближайшее время.
      </p>
      <div>
        <Button
          onClick={onClose}
          className="flex items-center gap-2 px-8 py-2 rounded-md bg-landing-card border border-border text-sm cursor-pointer"
        >
          Понятно
        </Button>
      </div>
    </div>
  </motion.div>
);

const Contacts = () => {
  const env = useEnv();

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    username: "",
    message: "",
  });

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;

  //   // If field is username
  //   if (name === "username") {
  //     // Regex to allow only valid Telegram username characters
  //     const validUsername = value
  //       .replace(/[^a-zA-Z0-9_]/g, "") // Removes invalid characters
  //       .slice(0, 32); // Limits length to 32 characters

  //     setData((prev) => ({
  //       ...prev,
  //       username: validUsername,
  //     }));

  //     return;
  //   }

  //   setData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!(data.username && data.message)) {
      setError("Please fill all the fields properly");
      return;
    }

    try {
      setIsSubmitting(true);

      // const url = config.botUrl + "/contacts";

      // const res = await axios.post(url, data);

      // console.log(res.data);

      setData({
        username: "",
        message: "",
      });

      setIsSuccess(true);
    } catch (error) {
      void error;
      setError(
        'Error in sending form! Please try again. If problem still exists, please contact our technicians using the button "Open chat".',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full border border-border rounded-lg">
      {isSuccess && <SuccessMessage onClose={() => setIsSuccess(false)} />}
      <motion.div
        initial={{ opacity: 0, filter: "blur(0px)" }}
        animate={{
          opacity: isSuccess ? 0.5 : 1,
          filter: isSuccess ? "blur(6px)" : "blur(0px)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between w-full max-md:flex-col pointer-events-auto"
      >
        <div className="flex flex-col px-4 py-4 gap-4">
          <h2 className="font-bold text-4xl mb-4 mt-2 text-nowrap">
            Contact us
          </h2>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Legal Entity</span>
            <span className="text-lg font-bold">
              {env.SITE_NAME} Company LLC
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Legal Address</span>
            <span className="text-lg font-bold">
              1016 W Jackson Blvd, Chicago, IL 60607
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Technical support</span>
            <Link
              className="flex items-center gap-2 hover:underline text-accent"
              href={env.SUPPORT_LINK}
            >
              Open chat
              <ExternalLink className="inline-block mr-1" size={16} />
            </Link>
          </div>
        </div>
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-4 py-6 w-1/2 max-md:w-full"
        >
          {/* <AtSign className="absolute ml-4 size-4" /> */}
          <CustomTextField
            isVisualRequired
            // icon={<AtSign className="size-3.5 mt-0.5 mx-2" />}
            label="E-mail"
            inputProps={{
              placeholder: "john.smith@example.com",
            }}
          />
          <CustomTextArea
            isVisualRequired
            label="Message"
            textAreaProps={{
              className: "resize-none h-40 pt-2.5",
              placeholder: "Explain the details",
            }}
          />
          <div className="text-xs text-text-secondary">
            By clicking on &quot;Send message&quot; you give us permission to
            process the data you provided.
          </div>
          {error && <div className="px-4 text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            className="relative bg-white font-medium text-background text-left rounded-sm px-6 py-4 overflow-hidden hover:text-white hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
            isDisabled={isSubmitting}
          >
            {!isSubmitting ? (
              <div className="flex items-center justify-between relative z-10 w-full pointer-events-none font-semibold">
                <span>Send message</span>
                <SendHorizonal size={14} />
              </div>
            ) : (
              <div>Sending...</div>
            )}
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default Contacts;
