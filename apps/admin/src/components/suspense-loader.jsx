import { motion } from "framer-motion";

const SuspenseLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white" role="status" aria-live="polite" aria-label="Loading dashboard">
            <div className="w-full max-w-xs px-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <img
                        src="/operia-logo.jpeg"
                        alt="Operio Business logo"
                        width={160}
                        height={160}
                        className="h-40 w-40 object-contain"
                    />

                </div>

                <div className="mt-6 h-1 overflow-hidden rounded-full bg-[#e6e6e6]" aria-hidden="true">
                    <motion.div
                        className="h-full rounded-full bg-[#4a154b]"
                        animate={{
                            x: ["-100%", "300%"],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SuspenseLoader;
