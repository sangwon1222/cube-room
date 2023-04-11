import * as PIXI from "pixi.js"
import { Character } from "./Character";
import { TileMap } from "./MapTile"

import { io, Socket } from "socket.io-client";



function delay( ms:number){
  return new Promise<void>( (resolve,reject)=>{
    setTimeout(()=>resolve(), ms);
  })
}

async function loadsResource(){
  await PIXI.Assets.load("./charac.png");
  await PIXI.Assets.load("./maptile.png");
  //await delay( 1000 );
}

export class Stage extends PIXI.Container {
  private mLogText = new PIXI.Text("log....",{
    fill: "#FFFFFF",
    dropShadow:true,
    fontSize: "14px"
  });

  private mMyID = "";
  private mMe:Character|null = null;
  private mTileMap = new TileMap();
  private mCharacters:Record<string,Character>={};
  private mCharacterPool = new PIXI.Container();
  get characterLayer(){ return this.mCharacterPool; };
  //private mCharacter = new Character();
  private mSocket:Socket|null = null;

  constructor() {
    super();
    this.removeChildren();
    this.init();
  }


  async resourceLoad(){
    this.mLogText.text = "resource load.."
    await loadsResource();
    this.mLogText.text = ""
    console.log("resource Load end ")
      
  }

  async init(){


    this.mTileMap.clear();
    this.addChild( this.mTileMap );
    this.addChild( this.characterLayer );
    //this.addChild( this.mCharacter );

    this.mLogText.position.set( 10,10);
    this.addChild( this.mLogText );

    await this.resourceLoad();
    
    // socket init
    
    this.mSocket = io("ws://192.168.0.3:3000", {
      // withCredentials: true,
      // extraHeaders: {
      //   "my-custom-header": "abcd"
      // }
    });
    
    // my connection maked( enterd )
    this.mSocket.on("welcome", (info:any) => {
      this.mMyID = info.id;
      
      // make other person's sprite
      for( const userinfo of info.users ){
        const charac = new Character( './charac.png' );
        charac.setTilePos( userinfo.pos[0], userinfo.pos[1] )
        if( userinfo.id == this.mMyID ){
          this.mMe = charac;
        }
        this.mCharacters[ userinfo.id ] = charac;
        this.characterLayer.addChild( charac );
      }

      // mapData init
      this.mTileMap.loadMap( info.mapData )
    
    });    

    // enter other person
    this.mSocket.on("entertUser", (info:any)=>{
      if( info.id != this.mMyID ){
        if( !this.mCharacters[ info.id ] ){
          const charac = new Character( './charac.png' );
          this.mCharacters[ info.id ] = charac;
          this.characterLayer.addChild( charac );
        }
      }
    })

    // leave other person
    this.mSocket.on("leaveUser", (info:any)=>{
      if( info.id != this.mMyID ){
        if( this.mCharacters[ info.id ] ){
          this.characterLayer.removeChild( this.mCharacters[ info.id ] );
          delete this.mCharacters[ info.id ];
        }
      }
    })

    // all person's movement signal 
    this.mSocket.on("move", (info:any)=>{
      if( this.mCharacters[ info.id ] ){
        this.mCharacters[ info.id ].movePath( info.paths );
      }
    })
      
    
    this.eventMode = 'static';
    this.onpointerup= async (evt:PIXI.FederatedPointerEvent)=>{
      const tilex = Math.floor( evt.x/48 );
      const tiley = Math.floor( evt.y/48 );
      // console.log( tilex,tiley );
      //this.emit( 'click-tile' as any , [tilex,tiley]);
      
      this.mSocket?.emit("moveReq",{
        id:this.mMyID, 
        startPos: [ this.mMe?.tilex,this.mMe?.tiley],
        endPos:[tilex,tiley
      ]});

      //await this.mCharacter.movePath( path );
      //inder.
      // this.mCharacter.moveToTile( tilex, tiley );
    }

    //await initResource();
    // const tileMap = new TileMap();
    // tileMap.on("click-tile" as any,(pos:[number,number])=>{
    //   console.log( "->",pos)
    // })
    // this.addChild( tileMap );
  
  }

}