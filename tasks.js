const { MongoClient } = require('mongodb');

const task = process.argv[2];

const URI = "mongodb://localhost:27017/";

async function main() {
  console.log('create client');
  const client = new MongoClient(URI);

  try {
    console.log('connecting')
    await client.connect();

    console.log('connected')
    await connected(client);
  } catch (error) {
    console.log('something went wrong :(')
    console.error(error)
  } finally {
    console.log('closing')
    await client.close();
    console.log('closed!')
  }
}

async function connected(client) {
  console.log('reference tasks collection')
  const tasks = await client.db("tasklist").collection("tasks");
  console.log('tasks collection found')

  if (task) {
    await addTask(tasks);
  } else {
    await listTasks(tasks);
  }
  console.log('connection complete')
}

async function addTask(tasks) {
  console.log('inserting task to collection')
  try {
    await tasks.insertOne( { task: task } )
  } catch (err) {
    console.error(err)
  } finally {
    console.log('New Task: ', task);
    await listTasks(tasks)  
  }
}

async function listTasks(tasks) {
  console.log('listing all tasks')
  const cursor = tasks.find();

  if ((await tasks.countDocuments()) === 0) {
    console.log('no documents found!')
    return;
  }

  for await (const doc of cursor) {
    console.log(doc)
  }

  console.log(`${await tasks.countDocuments()} documents in collection!`)
}

main().catch(console.error)