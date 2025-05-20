import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface YouTubeApiContextType {
  isYouTubeApiReady: boolean;
}

const YouTubeApiContext = createContext<YouTubeApiContextType | undefined>(
  undefined
);

export const useYouTubeApi = () => {
  const context = useContext(YouTubeApiContext);
  if (context === undefined) {
    throw new Error("useYouTubeApi must be used within a YouTubeApiProvider");
  }
  return context;
};

interface YouTubeApiProviderProps {
  children: ReactNode;
}

export const YouTubeApiProvider: React.FC<YouTubeApiProviderProps> = ({
  children,
}) => {
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState<boolean>(false);

  useEffect(() => {
    console.log("[YouTubeApiProvider] Initializing YouTube API...");

    if (window.YT && window.YT.Player) {
      console.log("[YouTubeApiProvider] YouTube API already available.");
      setIsYouTubeApiReady(true);
      return;
    }

    // Check if script is already there (e.g. from a previous provider instance or SSR)
    if (
      document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    ) {
      // If script tag exists, but window.YT is not ready, onYouTubeIframeAPIReady will handle it.
      // Or if window.YT IS ready, the above condition would have caught it.
      // We also need to handle if this provider mounts AFTER API ready callback has fired.
      // @ts-ignore
      if (window.YT_API_READY_FOR_PROVIDERS) {
        // Check a more specific flag
        console.log("[YouTubeApiProvider] API ready via global flag.");
        setIsYouTubeApiReady(true);
        return;
      }
    }

    // Assign the global callback
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      console.log(
        "[YouTubeApiProvider] window.onYouTubeIframeAPIReady called."
      );
      // @ts-ignore
      window.YT_API_READY_FOR_PROVIDERS = true; // Set our specific flag
      setIsYouTubeApiReady(true);
    };

    // Add the script tag if it doesn't exist
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        console.log("[YouTubeApiProvider] YouTube API script tag added.");
      } else {
        document.head.appendChild(tag);
        console.log(
          "[YouTubeApiProvider] YouTube API script tag added to head."
        );
      }
    } else {
      console.log(
        "[YouTubeApiProvider] YouTube API script tag already exists. Global callback is set."
      );
    }

    // Cleanup: The API and its callback are global.
    // We don't want to remove the callback if other parts of the app might still need it,
    // or if this provider unmounts and another mounts.
    // The script itself is also global.
    // Setting YT_API_READY_FOR_PROVIDERS and checking it handles re-mounts.
  }, []); // Runs once on mount

  return (
    <YouTubeApiContext.Provider value={{ isYouTubeApiReady }}>
      {children}
    </YouTubeApiContext.Provider>
  );
};
