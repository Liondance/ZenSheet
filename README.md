# ZenSheet Beta distributions

Note: as of this writing, this code is proprietary and meant only for testing ZenSheet and other ZenSheet related programs.

### Warning: the following instructions are for Windows.
It should not be hard to adapt them for Ubuntu ... we'll know soon.

## 1. Requisites

### GitHub

You must have a GitHub account and the GitHub client (GitHub CLI ) for Windows.

Follow instructions in the following sites:

    https://github.com/
    https://cli.github.com/

### Node.js

To download and install Node.js, follow the instructions in ***https://nodejs.org/en/***

Here is a sample shell interaction to verify that Node.js is working:

    liondance@Antares MINGW64 /e/Test/ZenSheet
    $ node
    Welcome to Node.js v16.14.0.
    Type ".help" for more information.
    > 6 * 7
    42
    > .exit

## 2. Getting the ZenSheet distribution

    1. Choose or create a directory to hold your clone of the ZenSheet distribution.
    But first, make sure that there isn't a directory named ZenSheet already there.

    2. Visit https://github.com/Liondance/ZenSheet
    Use the green 'Code' button to copy the connection string for your chosen protocol.
    In the next step, you will append the connection string to your git clone command.

    3. Execute the git clone command in the chosen directory, as follows:
      git clone <connection string>
    For instance, using the connection string for the SSH protocol, the command will be:
      git clone git@github.com:Liondance/ZenSheet.git

## 3. Starting ZenSheet distribution

A minimal ZenSheet deployment requires two processes:

- A ZenSheet Server
- A ZenSheet REPL Client

First, we strongly recommend running the server and client processes in different shell windows. Technically, you could start both processes in the same shell, running the ZenSheet Server in the background and the REPL in the foreground. However, it is best to have a separate windows to better distinguish server messages from REPL feedback. It also makes easier to kill the server, doing Ctrl^C in the corresponding window.
  
Here we show two ways to start the ZenSheet processes:

### Manual procedure

Open two window shells in the ZenSheet directory. The standard layout is shown in the image below:  

- The ZenSheet REPL Client is running on the left window
- The ZenSheet Server is running on the right window

![ZenSheet session: client (left) and server (right)](session.png)

Now, execute the following command in the ZenSheet Server window:

	./zensheet.exe --zst ./zst

Then, start the REPL in the ZenSheet Client window, as follows:

	node cli.js

### Semi-automated procedure, using convenience scripts

Open one window shell in the ZenSheet directory

Run the zen script, which should start the server in a separate shell window

	./zenstart

Run the cli script, which will run the ZenSheet REPL in your current window

	./cli

## 4. Testing ZenSheet

The REPL displays a strange prompt, with numbers, similar to this:

	<1: 1/1 => 1> _

The meaning of those numbers will be explained in the future.
For now, evaluate a simple expressions, like 6 * 7:

	<1: 1/1 => 1> 6 * 7

If everything is working well, ZenSheet will respond as follows:

	OK: 6 * 7 ==> 42

Which we can read as: "OK: six times seven yields forty-two.

You can exit the REPL and terminate execution of the server with the double dot command

	<2: 2/2 => 2> ..

## 5. Guided Testing and Feedback

Please follow the instructions for each week, answering questions and sending feedback via email.

***Thank you for your help***.

### Week 1

Go through the installation procedure and test ZenSheet as indicated.

1. Were the instructions easy to understand? If not, what should we improve?
2. Were you able to complete the installation? If not, where did you get stuck?
3. If you completed the installation, were you able to evaluate an expression?

Thank you again for contributing to the ZenSheet project!

#### Possible Issues

Whenever you encounter an issue, please let us know, even if you can resolve it.
A possible error is to be missing a dll file (dynamically linked library) in your system.
For convenience, dll files reported as missing (by some) are provided in the .lib directory.
To use a dll file provided in the .lib directory, simply copy it to your ZenSheet directory.
Only use dll files that match the name you see in the error message.
Do not copy or move dll files if ZenSheet is already working!

### Week 2

From now on you should always start the ZenSheet Server using this command: 

	./zensheet.exe --zst ./zst

The --zst option indicates the location of the ZenSheet tests database.
That's where the ZenSheet test scripts are located.
The REPL client can still be started as usual:

	node cli.js

But there is an even simpler way to start the server and the client, as explained next!

#### Semi-automated way to start a ZenSheet sessions, using convenience scripts

Instead of opening two shells, just open *one* in the ZenSheet directory.

Run the newly added zen script: this will start the server in a separate shell window!

	./zenstart

Then run the cli script, which will run the ZenSheet REPL in your current window.

	./cli

That's all: you only need to execute ***./zen*** and ***./cli*** to establish a session! 

#### Some useful REPL commands

You will find these commands convenient

	.                       => a single dot exits the REPL without terminating the server
	..                      => double dot exits the REPL and terminates the server
	run <script name>       => the run command runs a REPL script with commands

#### Testing ZenSheet and Measuring Performance

- Just in case, perform a git pull to download the most recent testing scripts
- Start a ZenSheet session (server and client) as explained above
- At the REPL prompt, issue the following commands:

(one by one, waiting for each command to complete)

	run quick
	run heavy
	run full

#### Giving Feedback for Week 2

Depending on the speed of your computer, some tests may take over 10 seconds to complete.
At the end of each test **run** you should see ***test statistics*** like this in the output:

	(.)(.) run full.sym: elapsed time (ms) ==> 7151
	passed 4119
	failed 0
	errors 0


- Copy and paste the test statistics, for each run, into your feedback email
- It would be useful to know which processor you have, GHz included

That's all for week 2!
