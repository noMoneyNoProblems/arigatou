import * as React from "react";
import {config} from "../config";
import { ComicsList } from "./ComicsList";
import {ComicIdentifier} from "./types/ComicIdentifier"

export interface HelloProps { compiler: string; framework: string; }

interface HelloState {comics: ComicIdentifier[]}

export class Hello extends React.Component<HelloProps, HelloState> {
    constructor(props: HelloProps){
      super(props);
      this.state = {
        comics: []
      }
      this.getComics();
    }

    private getComics()
    {
      fetch(config.server_url + "/api/comicsList")
      .then((resp: Response) => {
        return resp.json();
      })
      .then((data: any) => {
        console.log(data);
        this.setState({comics: data});
      })
      .catch((error: any) => {console.log(error)});
    }

    render() {
        return (
        <div>
          <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
          <ComicsList comics={this.state.comics} />
        </div>
        );
    }
}
