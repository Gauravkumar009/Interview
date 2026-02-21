const QUESTION_BANK = {
    Technical: [
        {
            question: "Explain the concept of Closures in JavaScript.",
            idealAnswer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.",
            keywords: ["function", "scope", "lexical", "outer", "inner"]
        },
        {
            question: "What is the difference between specificity and inheritance in CSS?",
            idealAnswer: "Specificity determines which CSS rule is applied by the browsers. Inheritance is the mechanism by which some properties pass down from parent elements to children.",
            keywords: ["rule", "browser", "parent", "child", "cascade"]
        },
        {
            question: "Explain the Virtual DOM in React.",
            idealAnswer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by calculating the difference (diffing) between the previous and current state and updating only the necessary parts of the real DOM.",
            keywords: ["copy", "diffing", "performance", "update", "real DOM"]
        },
        {
            question: "What are Promises in JavaScript?",
            idealAnswer: "Promises are objects representing the eventual completion or failure of an asynchronous operation.",
            keywords: ["async", "await", "callback", "resolve", "reject"]
        },
        {
            question: "Explain the difference between '==' and '===' in JavaScript.",
            idealAnswer: "'==' checks for value equality with type coercion, while '===' checks for both value and type equality (strict equality).",
            keywords: ["type", "equality", "coercion", "strict"]
        },
        {
            question: "What is the useEffect hook used for?",
            idealAnswer: "useEffect is used for side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
            keywords: ["side effect", "functional", "lifecycle", "mount", "update"]
        },
        {
            question: "What is hoisting in JavaScript?",
            idealAnswer: "Hoisting is JavaScript's behavior of moving declarations to the top of the current scope. Variables defined with var are hoisted and initialized with undefined, while let and const are hoisted but not initialized (TDZ).",
            keywords: ["hoisting", "declaration", "scope", "var", "let"]
        },
        {
            question: "Explain event bubbling and capturing.",
            idealAnswer: "Event bubbling propagates events from the target element up to the root, while capturing propagates from the root down to the target. Configuring event listeners can control which phase triggers the handler.",
            keywords: ["propagation", "target", "root", "bubbling", "capture"]
        },
        {
            question: "What is the Box Model in CSS?",
            idealAnswer: "The Box Model consists of margins, borders, padding, and the actual content area. It determines the space an element occupies.",
            keywords: ["margin", "border", "padding", "content", "width"]
        },
        {
            question: "What is 'this' keyword in JavaScript?",
            idealAnswer: "'this' refers to the object that is executing the current function. Its value depends on how the function is called (method invocation, function invocation, constructor, etc.).",
            keywords: ["context", "object", "execution", "call", "bind"]
        },
        {
            question: "Explain the difference between let, const, and var.",
            idealAnswer: "var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned, while let can.",
            keywords: ["scope", "block", "hoisted", "assignment", "reassignment"]
        },
        {
            question: "What is a callback function?",
            idealAnswer: "A callback is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action.",
            keywords: ["argument", "invoke", "passed", "async", "execution"]
        },
        {
            question: "What is REST API?",
            idealAnswer: "REST (Representational State Transfer) is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate.",
            keywords: ["architecture", "http", "stateless", "resource", "endpoint"]
        },
        {
            question: "Explain MVC architecture.",
            idealAnswer: "MVC stands for Model-View-Controller. It separates an application into three main logical components: the Model (data), the View (UI), and the Controller (logic/input).",
            keywords: ["model", "view", "controller", "separation", "logic"]
        },
        {
            question: "What is Node.js?",
            idealAnswer: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows running JavaScript on the server-side.",
            keywords: ["runtime", "server", "v8", "javascript", "backend"]
        },
        {
            question: "What is Redux?",
            idealAnswer: "Redux is a predictable state container for JavaScript apps. It helps write applications that behave consistently and run in different environments (client, server, native).",
            keywords: ["state", "store", "reducer", "action", "dispatch"]
        }
    ],
    HR: [
        {
            question: "Tell me about yourself.",
            idealAnswer: "I am a passionate developer with experience in...",
            keywords: ["experience", "passion", "background", "skills"]
        },
        {
            question: "Why do you want to work here?",
            idealAnswer: "I admire the company's mission and technical challenges...",
            keywords: ["mission", "values", "challenge", "growth"]
        },
        {
            question: "What are your greatest strengths?",
            idealAnswer: "I am a quick learner and a team player...",
            keywords: ["learning", "team", "adaptable", "communication"]
        },
        {
            question: "Where do you see yourself in 5 years?",
            idealAnswer: "I hope to grow into a senior role and lead projects...",
            keywords: ["growth", "senior", "leadership", "impact"]
        }
    ],
    Behavioral: [
        {
            question: "Describe a time you faced a difficult challenge.",
            idealAnswer: "Using the STAR method (Situation, Task, Action, Result)...",
            keywords: ["STAR", "challenge", "overcame", "team"]
        },
        {
            question: "Tell me about a time you had a conflict with a coworker.",
            idealAnswer: "I handled it by communicating openly and finding a compromise...",
            keywords: ["conflict", "communication", "resolution", "compromise"]
        },
        {
            question: "Describe a time you failed and how you handled it.",
            idealAnswer: "I analyzed my mistake, learned from it, and improved my process...",
            keywords: ["failure", "learning", "improvement", "resilience"]
        }
    ],
    "Data Science": [
        {
            question: "What is the difference between supervised and unsupervised learning?",
            idealAnswer: "Supervised learning uses labeled data to train models (e.g., regression, classification), while unsupervised learning uses unlabeled data to find patterns (e.g., clustering, dimensionality reduction).",
            keywords: ["supervised", "unsupervised", "labeled", "patterns", "clustering"]
        },
        {
            question: "Explain the bias-variance tradeoff.",
            idealAnswer: "Bias is the error from erroneous assumptions (underfitting). Variance is the error from sensitivity to small fluctuations (overfitting). The tradeoff is minimizing both to achieve good generalization.",
            keywords: ["bias", "variance", "underfitting", "overfitting", "generalization"]
        },
        {
            question: "What is a confusion matrix?",
            idealAnswer: "A table used to describe the performance of a classification model. It shows True Positives, True Negatives, False Positives, and False Negatives.",
            keywords: ["classification", "performance", "TP", "TN", "FP", "FN"]
        },
        {
            question: "Explain overfitting and how to prevent it.",
            idealAnswer: "Overfitting happens when a model learns noise instead of the signal. Prevention includes cross-validation, regularization (L1/L2), pruning, and using more data.",
            keywords: ["noise", "signal", "regularization", "cross-validation", "pruning"]
        },
        {
            question: "What is Random Forest?",
            idealAnswer: "Random Forest is an ensemble learning method that constructs multiple decision trees during training. The output is the mode of the classes (classification) or mean prediction (regression) of the individual trees.",
            keywords: ["ensemble", "decision trees", "training", "classification", "regression"]
        },
        {
            question: "What is the difference between specific gradient descent and stochastic gradient descent?",
            idealAnswer: "Gradient descent calculates the error for the entire dataset before updating weights. Stochastic gradient descent (SGD) updates weights after each training example, making it faster but noisier.",
            keywords: ["batch", "stochastic", "update", "weights", "dataset"]
        },
        {
            question: "Explain Precision and Recall.",
            idealAnswer: "Precision is the ratio of correctly predicted positive observations to total predicted positives. Recall is the ratio of correctly predicted positive observations to all observations in the actual class.",
            keywords: ["precision", "recall", "positive", "ratio", "accuracy"]
        },
        {
            question: "What is A/B testing?",
            idealAnswer: "A/B testing is a user experience research methodology causing two variants (A and B) to be compared. It is used to determine which variation performs better for a given conversion goal.",
            keywords: ["variants", "comparison", "conversion", "experiment", "control"]
        }
    ],
    "Java": [
        {
            question: "What is the difference between JDK, JRE, and JVM?",
            idealAnswer: "JDK (Java Development Kit) is for development. JRE (Java Runtime Environment) is for running applications. JVM (Java Virtual Machine) executes the bytecode.",
            keywords: ["JDK", "JRE", "JVM", "development", "runtime"]
        },
        {
            question: "Explain the difference between an interface and an abstract class.",
            idealAnswer: "An interface cannot have state or constructor (prior to Java 8/9 changes), while an abstract class can. A class can implement multiple interfaces but extend only one abstract class.",
            keywords: ["interface", "abstract", "extend", "implement", "inheritance"]
        },
        {
            question: "What is the detailed functioning of HashMap?",
            idealAnswer: "HashMap uses hashing. It stores data in Entry objects (key-value pairs) in buckets. `put()` determines the bucket using `hashCode()`. Collisions are handled via LinkedList (or Red-Black Tree in Java 8+).",
            keywords: ["hashing", "bucket", "collision", "hashCode", "equals"]
        },
        {
            question: "What are the SOLID principles?",
            idealAnswer: "SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They are design principles for maintainable code.",
            keywords: ["SOLID", "design", "principles", "maintainable", "object-oriented"]
        },
        {
            question: "Explain the difference between '==' and '.equals()' in Java.",
            idealAnswer: "'==' checks for reference equality (memory address), whereas `.equals()` is a method used to check for value/content equality.",
            keywords: ["reference", "value", "memory", "equality", "comparison"]
        }
    ],
    "Full Stack Developer": [
        {
            question: "Explain the Virtual DOM in React.",
            idealAnswer: "The Virtual DOM is a lightweight copy of the real DOM. React updates the Virtual DOM first, compares it with the previous version (diffing), and only updates the changes in the real DOM (reconciliation).",
            keywords: ["virtual dom", "diffing", "reconciliation", "performance", "react"]
        },
        {
            question: "What is middleware in Node.js/Express?",
            idealAnswer: "Middleware functions have access to the request object (req), the response object (res), and the next middleware function. They can modify objects, end the cycle, or call next().",
            keywords: ["middleware", "express", "request", "response", "next"]
        },
        {
            question: "Difference between SQL and NoSQL databases.",
            idealAnswer: "SQL databases are relational, table-based, and have a fixed schema (e.g., MySQL). NoSQL databases are non-relational, document/key-value based, and have a dynamic schema (e.g., MongoDB).",
            keywords: ["relational", "schema", "table", "document", "sql", "nosql"]
        },
        {
            question: "What is the purpose of Redux?",
            idealAnswer: "Redux is a state management library. It stores the entire state of the application in a single central store, making state predictable and easier to debug.",
            keywords: ["state management", "store", "actions", "reducers", "predictable"]
        },
        {
            question: "Explain CORS and how to handle it.",
            idealAnswer: "CORS (Cross-Origin Resource Sharing) is a security feature that restricts web pages from making requests to a different domain than the one that served the web page. It is handled by setting appropriate headers on the server.",
            keywords: ["CORS", "security", "headers", "access-control", "origin"]
        },
        {
            question: "What is Hoisting in JavaScript?",
            idealAnswer: "Hoisting is JavaScript's default behavior of moving declarations to the top. var declarations are hoisted and initialized with undefined, while let/const are hoisted but remain in the 'temporal dead zone'.",
            keywords: ["hoisting", "var", "let", "const", "execution context"]
        },
        {
            question: "Explain the Box Model in CSS.",
            idealAnswer: "The CSS Box Model consists of: Content, Padding (space inside), Border (around padding), and Margin (space outside). It determines the layout and design of elements.",
            keywords: ["box model", "padding", "border", "margin", "layout"]
        },
        {
            question: "What are Promises and Async/Await?",
            idealAnswer: "Promises represent the eventual completion (or failure) of an asynchronous operation. Async/Await is syntactic sugar over Promises, making code look synchronous and easier to read.",
            keywords: ["asynchronous", "promise", "async", "await", "callback"]
        }
    ],
    "Frontend Developer": [
        {
            question: "Explain the Critical Rendering Path.",
            idealAnswer: "The sequence of steps the browser takes to convert HTML, CSS, and JS into pixels on the screen. Optimizing this path improves performance.",
            keywords: ["rendering", "performance", "dom", "cssom", "paint"]
        },
        {
            question: "What is the difference between Local Storage, Session Storage, and Cookies?",
            idealAnswer: "Local Storage persists until deleted. Session Storage lasts until the tab is closed. Cookies are sent with every HTTP request and have expiration dates.",
            keywords: ["storage", "cookies", "session", "local", "persistence"]
        },
        {
            question: "Explain Event Delegation.",
            idealAnswer: "Attaching a single event listener to a parent element to handle events on its children using the event bubbling phase. Only one listener is needed for many elements.",
            keywords: ["event", "delegation", "bubbling", "listener", "performance"]
        },
        {
            question: "What is Responsive Design?",
            idealAnswer: "Designing web pages that look good on all devices (desktops, tablets, and phones) using flexible grids, layouts, and CSS media queries.",
            keywords: ["responsive", "media queries", "layout", "mobile", "css"]
        }
    ],
    "Backend Developer": [
        {
            question: "What is REST vs. GraphQL?",
            idealAnswer: "REST is an architectural style using standard HTTP methods and multiple endpoints. GraphQL is a query language for APIs allowing clients to request exactly the data they need in a single request.",
            keywords: ["rest", "graphql", "api", "endpoint", "query"]
        },
        {
            question: "Explain Database Indexing.",
            idealAnswer: "Indexing is a data structure technique to quickly locate and access the data in a database table. Indexes are created using one or more columns.",
            keywords: ["database", "index", "performance", "query", "optimization"]
        },
        {
            question: "What is the difference between Authentication and Authorization?",
            idealAnswer: "Authentication verifies who a user is (e.g., login). Authorization determines what resources an authenticated user can access (e.g., permissions).",
            keywords: ["auth", "login", "permission", "security", "access"]
        },
        {
            question: "How do you handle API Rate Limiting?",
            idealAnswer: "Rate limiting controls the number of requests a user can make in a given timeframe to prevent abuse. Techniques include Token Bucket, Leaky Bucket, or Fixed Window counters.",
            keywords: ["rate limit", "api", "security", "throttle", "performance"]
        }
    ],
    "Cyber Security": [
        {
            question: "Explain the difference between Symmetric and Asymmetric encryption.",
            idealAnswer: "Symmetric uses the same key for encryption and decryption (faster). Asymmetric uses a public key for encryption and a private key for decryption (more secure exchange).",
            keywords: ["encryption", "keys", "symmetric", "asymmetric", "security"]
        },
        {
            question: "What is Cross-Site Scripting (XSS)?",
            idealAnswer: "XSS is a vulnerability where attackers inject malicious scripts into webpages viewed by other users. Fix: Sanitize inputs and establish CSP headers.",
            keywords: ["XSS", "injection", "script", "vulnerability", "sanitize"]
        },
        {
            question: "What is SQL Injection and how do you prevent it?",
            idealAnswer: "SQL Injection allows attackers to interfere with database queries. Prevention: Use prepared statements (parameterized queries) and input validation.",
            keywords: ["sql", "injection", "database", "prepared statements", "security"]
        },
        {
            question: "Explain the purpose of a Firewall.",
            idealAnswer: "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
            keywords: ["network", "traffic", "security", "rules", "monitor"]
        }
    ],
    "Android": [
        {
            question: "What is the Activity Lifecycle in Android?",
            idealAnswer: "onCreate() -> onStart() -> onResume() -> onPause() -> onStop() -> onDestroy(). It manages the state of the UI screen.",
            keywords: ["activity", "lifecycle", "android", "ui", "state"]
        },
        {
            question: "Difference between explicit and implicit Intents.",
            idealAnswer: "Explicit intents specify the exact component to start (e.g., target Activity). Implicit intents specify an action (e.g., VIEW_URL) and let the OS find a handler.",
            keywords: ["intent", "explicit", "implicit", "component", "action"]
        },
        {
            question: "What is a Fragment?",
            idealAnswer: "A Fragment represents a reusable portion of an Activity's behavior or UI. It has its own lifecycle but must be hosted by an Activity.",
            keywords: ["fragment", "activity", "ui", "reusable", "lifecycle"]
        }
    ],
    "iOS": [
        {
            question: "Explain the difference between let and var in Swift.",
            idealAnswer: "`let` defines a constant (immutable), while `var` defines a variable (mutable).",
            keywords: ["swift", "let", "var", "immutable", "mutable"]
        },
        {
            question: "What is ARC (Automatic Reference Counting)?",
            idealAnswer: "ARC is a memory management feature in Swift/Obj-C that automatically clears up memory used by class instances when they are no longer needed.",
            keywords: ["memory", "management", "reference", "counting", "garbage collection"]
        },
        {
            question: "What are Optionals in Swift?",
            idealAnswer: "Optionals are a type that handles the absence of a value. They can either hold a value or be `nil`. You must unwrap them to access the value.",
            keywords: ["optional", "nil", "unwrap", "swift", "null safety"]
        }
    ],
    "DevOps": [
        {
            question: "What is the difference between Docker and a Virtual Machine?",
            idealAnswer: "VMs run a full OS with its own kernel (heavy). Docker containers share the host OS kernel and are lightweight, isolated processes.",
            keywords: ["docker", "vm", "container", "kernel", "virtualization"]
        },
        {
            question: "Explain CI/CD.",
            idealAnswer: "Continuous Integration (CI) merges code changes frequently with automated testing. Continuous Deployment/Delivery (CD) overrides the release process to deploy code automatically.",
            keywords: ["ci", "cd", "automation", "testing", "deployment"]
        },
        {
            question: "What is Kubernetes?",
            idealAnswer: "Kubernetes (K8s) is an open-source platform for automating deployment, scaling, and management of containerized applications.",
            keywords: ["orchestration", "scaling", "containers", "deployment", "k8s"]
        }
    ],
    "Python": [
        {
            question: "Difference between list and tuple in Python.",
            idealAnswer: "Lists are mutable (can be changed), while tuples are immutable. Lists use brackets [], tuples use parentheses ().",
            keywords: ["list", "tuple", "mutable", "immutable", "python"]
        },
        {
            question: "What are decorators in Python?",
            idealAnswer: "Decorators are a way to modify the behavior of a function or class without changing its source code, often using the @symbol.",
            keywords: ["decorator", "wrapper", "function", "modify", "behavior"]
        },
        {
            question: "Explain the difference between deep copy and shallow copy.",
            idealAnswer: "Shallow copy creates a new object but inserts references into it. Deep copy creates a new object and recursively copies the objects found in the original.",
            keywords: ["copy", "deep", "shallow", "reference", "memory"]
        }
    ],
    "C++": [
        {
            question: "What are the four pillars of OOP?",
            idealAnswer: "Encapsulation, Abstraction, Inheritance, and Polymorphism.",
            keywords: ["oop", "encapsulation", "inheritance", "polymorphism", "abstraction"]
        },
        {
            question: "Difference between `malloc()` and `new`.",
            idealAnswer: "`malloc()` is a C library function that allocates memory but doesn't call constructors. `new` is a C++ operator that allocates memory and calls constructors.",
            keywords: ["memory", "allocation", "constructor", "malloc", "new"]
        },
        {
            question: "What is a virtual function?",
            idealAnswer: "A member function declared within a base class and redefined (overridden) by a derived class. It ensures the correct function is called for an object, regardless of the type of reference (polymorphism).",
            keywords: ["virtual", "polymorphism", "override", "inheritance", "base class"]
        }
    ],
    "C#": [
        {
            question: "Difference between `ref` and `out` parameters.",
            idealAnswer: "`ref` requires the variable to be initialized before passing. `out` does not require initialization before passing but must be assigned a value within the method.",
            keywords: ["ref", "out", "parameter", "initialization", "method"]
        },
        {
            question: "What is the difference between Interface and Abstract Class in C#?",
            idealAnswer: "An interface contains only method declarations (no implementation). An abstract class can contain both method declarations and implementations. A class can implement multiple interfaces but inherit only one abstract class.",
            keywords: ["interface", "abstract", "inheritance", "implementation", "multiple"]
        },
        {
            question: "What is LINQ?",
            idealAnswer: "Language Integrated Query (LINQ) is a query syntax available in C# to retrieve data from different sources like XML, Collections, and Databases.",
            keywords: ["linq", "query", "data", "syntax", "collection"]
        }
    ]
};

module.exports = QUESTION_BANK;
