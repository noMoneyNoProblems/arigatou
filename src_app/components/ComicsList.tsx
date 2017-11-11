import * as React from "react";
import {ComicIdentifier} from "./types/ComicIdentifier"

export interface ComicsListProps { comics: ComicIdentifier[]; }

export class ComicsList extends React.Component<ComicsListProps, {}> {
    render() {
            return (
              <div>Comics
               <ul>
                  {this.props.comics.map((c) =>
                    {return (<li>{c}</li>)}
                  )}
               </ul>
              </div>
            );
    }
}
