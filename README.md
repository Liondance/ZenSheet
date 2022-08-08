# ZenSheet

ZenSheet Beta distribution - Windows version

## Requisites

### 1. GitHub

You must have a GitHub account and the GitHub client (GitHub CLI ) for Windows.
Follow instructions in the following sites:

  https://github.com/
  https://cli.github.com/

### 2. Node.js

To download and install Node.js, follow the instructions in ***https://nodejs.org/en/***

Here is sample shell interaction to verify that Node.js is working:

    liondance@Antares MINGW64 /e/Test/ZenSheet
    $ node
    Welcome to Node.js v16.14.0.
    Type ".help" for more information.
    > 6 * 7
    42
    > .exit

## Getting the ZenSheet distribution

    1. Choose or create a directory to hold your clone of the ZenSheet distribution.
    But first, make sure that there isn't a directory named ZenSheet already there.

    2. Visit https://github.com/Liondance/ZenSheet
    Use the green 'Code' button to copy the connection string for your chosen protocol.
	You will append the connection string to your git clone command.

    3. Execute the git clone command in the chosen directory:
      git clone <connection string>
    For instance, using the connection string for the SSH protocol, the command will be:
      git clone git@github.com:Liondance/ZenSheet.git

## Testing the ZenSheet distribution

A minimal ZenSheet deployment requires two processes:

- A ZenSheet Server
- A ZenSheet REPL Client

In a moment we will tell you how to start these processes. First, you should know that we strongly recommend running the server and client processes in different shell windows. Technically, we could start both processes in the same shell, running the ZenSheet Server in the background and the REPL in the foreground. However, it is best to have a separate windows to better distinguish server messages from REPL feedback. It also makes easier to kill the server, doing Ctrl^C in the corresponding window.    
  
Here is how to start the ZenSheet processes:

First, have two window shells open in the ZenSheet directory: 

	The standard layout is shown in the image below:  
	- The ZenSheet REPL Client is running on the left window
	- The ZenSheet Server is running on the right window

![ZenSheet session: client (left) and server (right)](session.png)

Now, execute the following command in the ZenSheet Server window: 

	./zensheet.exe

Then, start the REPL in the ZenSheet Client window, as follows:

	node cli.js

The REPL displays a strange prompt, with numbers, similar to this:

	<1: 1/1 => 1> _

The meaning of those numbers will be explained in the future.
For now, evaluate a simple expressions, like 6 * 7:

	<1: 1/1 => 1> 6 * 7

If everything is working well, ZenSheet will respond as follows:

	OK: 6 * 7 ==> 42

Which we can read as: "OK: six times seven yields forty-two

## Feedback

Thank you for your help. Please let me know:

1. Were these instructions easy to understand? If not, what should we improve?
2. Were you able to complete the installation? If not, where did you get stuck?
3. If you completed the installation, were you able to evaluate an expression?

Thank you again for contributing to the ZenSheet project!
