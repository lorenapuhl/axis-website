"use client" // ANALOGY: Like 'if __name__ == "__main__":' for the browser. Tells Next.js this file needs JavaScript to work.

import { motion } from "framer-motion"; // CSS: Think of this as a library that writes complex @keyframes for you.
import { useEffect, useRef, useState } from "react"; // PYTHON: These are like built-in modules (time, random, sys).
import { cn } from "@/lib/utils"; // CSS: A "helper" to combine class names (e.g., "btn" + " btn-red").

// --- THE HERO SECTION (The "Parent" Layout) ---
export const ShuffleHero = () => {
  return (
    // HTML: <section>. CSS: A Grid with 1 column on mobile, 2 columns on medium (md) screens.
    <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
      <div>
        {/* HTML: <span>. CSS: text-primary pulls a color variable from your global CSS. */}
        <span className="block mb-4 text-xs md:text-sm text-primary font-medium">
          Better every day
        </span>
        {/* HTML: <h3>. CSS: text-4xl/6xl makes it huge responsive text. */}
        <h3 className="text-4xl md:text-6xl font-semibold text-foreground">
          Let's change it up a bit
        </h3>
        {/* HTML: <p>. CSS: my-4/6 adds "margin-top" and "margin-bottom". */}
        <p className="text-base md:text-lg text-muted-foreground my-4 md:my-6">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nobis in
          error repellat voluptatibus ad.
        </p>
        {/* HTML: <button>. CSS: uses "cn" to merge multiple strings of Tailwind classes. */}
        <button className={cn(
          "bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md",
          "transition-all hover:bg-primary/90 active:scale-95", // CSS: transition/hover effects.
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}>
          Find a class
        </button>
      </div>
      {/* HTML: This places the "ShuffleGrid" component (defined below) right here. */}
      <ShuffleGrid />
    </section>
  );
};

// --- THE SHUFFLE LOGIC (The Math) ---
// This is a function that takes a List (Array) and randomly re-orders it.
// Python Analogy: random.sample(squareData, len(squareData))
const shuffle = (array: (typeof squareData)[0][]) => { // 'array' is the input. The extra text is just TypeScript "Types".
  let currentIndex = array.length, // Get the total number of items in the list (Python: len(array)).
    randomIndex; // Create a variable to hold a random number.

  while (currentIndex != 0) { // Keep looping as long as there are items left to shuffle.
    randomIndex = Math.floor(Math.random() * currentIndex); // Pick a random index (Python: random.randint).
    currentIndex--; // Subtract 1 from the counter (Python: currentIndex -= 1).

    // This line swaps two items in the list.
    // It's the JavaScript version of Python's: array[a], array[b] = array[b], array[a]
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]; // End swap.
  } // End while loop.

  return array; // Return the new, randomly ordered list.
}; // End shuffle function.

// --- THE DATA (A list of dictionaries) ---
const squareData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1510925758641-869d353cecc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1580238053495-b9720401fd45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1569074187119-c87815b476da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1325&q=80",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 8,
    src: "https://plus.unsplash.com/premium_photo-1671436824833-91c0741e89c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1610768764270-790fbec18178?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1507034589631-9433cc6bc453?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=684&q=80",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=882&q=80",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1606244864456-8bee63fce472?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=681&q=80",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1820&q=80",
  },
];

// --- THE COMPONENT MAKER (Turning data into HTML) ---
const generateSquares = () => {
  // PYTHON: [f"<div>{sq['src']}</div>" for sq in shuffle(squareData)] (List Comprehension)
  // Use {} inside HTML code to implement JavaScript Logic
  // shuffle(squareData): This calls the math function you wrote earlier. It takes your original list of 16 images and returns a new list in a random order. Python Analogy: random.sample(squareData, len(squareData))
  // .map(): This is a built-in JavaScript method that "loops" through every item in a list and transforms it into something else. 
  // This is an Arrow Function. It defines a temporary variable name (sq) for the current item in the loop. Python Analogy: for sq in shuffled_list:
  return shuffle(squareData).map((sq) => (
  
    // Create HTML <div> environment for every image using motion library for animations
    <motion.div
      key={sq.id} // REACT: Needs a unique ID to track which element is which during animation.
      layout // MOTION: Enables "Automatic Layout Animations" (items slide to new positions).
      transition={{ duration: 1.5, type: "spring" }} // CSS: Sets the animation speed/style.
      className="w-full h-full rounded-md overflow-hidden bg-muted" // CSS: Basic box styling.
      style={{
        backgroundImage: `url(${sq.src})`, // CSS: inline style "background-image: url(...)".
        backgroundSize: "cover", // CSS: ensures image fills the square.
        backgroundPosition: "center", // CSS: centers the image in the square.
      }}
    ></motion.div>
  ));
};

// --- THE GRID COMPONENT (The animated picture box) ---
const ShuffleGrid = () => {
  // REACT: useRef is like a variable that doesn't disappear when the function re-runs.
  // This part inside the "angle brackets" is the Type Definition in TypeScript
  // NodeJS.Timeout: This part inside the "angle brackets" is the Type Definition in TypeScript
  // |: This is the "OR" operator (a Union).
  // null: "This box can also be empty."
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  
  // REACT: Initializing the useState-Hook with the initial value yielded from generateSquares(). Yields the array [squares, setSquares] (squares = current data, setSquares = function to update it).
  // ERROR SOURCE (HYDRATION ERROR): Running useState(generateSquares()) here happens on both Server and Client with different random results.
  // CORRECTION: useState<any[]>([]): Running useState on an empty list ([])
  //TypeScript type-definition using <>-syntax: Defining the type of ([]): This state will always be an Array ([]) of Any type of data."
  const [squares, setSquares] = useState<any[]>([]);

  // REACT: useEffect is like an "On Page Load" event listener.
  //In a normal Python script, you might just call shuffle_squares() at the bottom of the file. In React, if you just call a function inside the component normally, it will run every single time the component updates (which could be 60 times a second!). useEffect allows you to say: "Run this code once, specifically after the HTML has been painted on the screen."
  useEffect(() => {
    shuffleSquares(); // Call the shuffle function.

    // PYTHON: Like a "try/finally" cleanup. Stops the timer if you close the tab.
    // return () => { ... } is a Cleanup Function. Imagine the user clicks a link to go to a different page. Your ShuffleGrid component is "unmounted" (removed from the screen).
    //
    return () => {
      if (timeoutRef.current) { //"Check the 'Storage Box' (Ref). Is there a Timer ID inside?" If so, timeoutRef.current = true.
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // The "[]" means: "Run this effect only once, when the component first appears."

  // FUNCTION: Updates the "Memory" (state) with a new shuffled list every 3 seconds.
  const shuffleSquares = () => {
    // We previously defined the useState hook: const [squares, setSquares] = useState(generateSquares());
    // squares: The actual list of 16 image boxes (The Data).
    // setSquares: The function React gave you to update that list. Every time setSquares is called, the UI is updated because of the useState-hook framework
    // generateSquares(): The function we previously defined to create the HTML picture grid. 
    
    // generateSquares(): This runs first. it picks your 16 images, shuffles them, and builds 16 new motion.div HTML tags.
    // setSquares(...): This takes those 16 new tags and saves them into React's memory (State).
    // The Result: Because you used the "Setter" function, React sees the change and re-draws the grid on your screen. Because of the layout prop on your images, they slide smoothly to their new spots.
    setSquares(generateSquares());

    // timeoutRef.current: Saving the ID obtained when calling setTimeout(shuffleSquares, 5000) into your useRef storage box (timeoutRef.current).
    // setTimeout(shuffleSquares, 5000): "Hey Browser, wait 5000ms (5 seconds). When that time is up, I want you to run the function called shuffleSquares again."
    timeoutRef.current = setTimeout(shuffleSquares, 5000);
  };

  return (
    // CSS: A grid container with 4 columns and 4 rows.
    <div className="grid grid-cols-4 grid-rows-4 h-[450px] gap-1">
      {/* HTML: Loops through the 'squares' list (already HTML-styled) in memory and renders each <div>. */}
      {squares.map((sq) => sq)}
    </div>
  );
};
