import { Server } from "socket.io";
import * as pathfinder from "pathfinding"

const mapData = [
  [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0,0 ],
  [0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0 ],
  [0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
];

// 개별 처리
//let grid = new pathfinder.Grid( mapData[0].length, mapData.length );
//grid.setWalkableAt(0, 1, false);

const grid = new pathfinder.Grid(mapData);
const finder = new pathfinder.AStarFinder();
    
const io = new Server(3000,{
  cors: {
    origin: "*",
    //allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on("connection", async (socket) => {
  //console.log("client comming..", socket.id);
  
  socket.data.pos = [0,0];
  const sockets = await io.fetchSockets();
  
  const userInfo = sockets.map( (v)=>{
    return {id:v.id, pos:v.data.pos} 
  });
  socket.emit("welcome",{ id:socket.id, users:userInfo,mapData:mapData } );
  socket.broadcast.emit("entertUser",{ id:socket.id } );

  // receive a message from the client
  socket.on("moveReq", (info:any) => {
    // ...
    console.log("move:", info.id, info.startPos, info.endPos );
    const map = grid.clone();
    
    const path = finder.findPath( 
      info.startPos[0], info.startPos[1], 
      info.endPos[0], info.endPos[1], 
      map
    );

    if( path.length>0){
      const endPos = path[path.length-1];
      socket.data.pos = endPos;
      socket.emit("move",{ id:socket.id, paths: path } );
      socket.broadcast.emit("move",{ id:socket.id, paths: path } );      
    }

  });
  socket.on('updatePos',( pos:Array<number> )=>{
    socket.data.pos = pos;
  })
  socket.on('disconnect',()=>{
    socket.broadcast.emit("leaveUser",{id:socket.id})
  })
});