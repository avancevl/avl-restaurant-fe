import { ApiClassName as ApiClassNameOrigin } from 'ts/constant/api';
import { AppRoute as AppRouteOrigin } from 'ts/ng/router/app';
import { BasicState as BasicStateOrigin } from 'ts/constant/basic-state';
import { Global as GlobalOrigin } from 'ts/globle';
import { IStoreListener, StoreNode } from '@cui/core';
import { OnDestroy } from '@angular/core';
import { TranslateSourceAll as TranslateSourceAllOrigin } from 'ts/translate/TranslateSourceAll';
import { environment } from '@environment';



interface Nodes {
    [key: string]: StoreNode<any>;
}
interface NodeHandlers {
    [key: string]: IStoreListener[];
}

export abstract class BasicComponent implements OnDestroy {
    public env = environment;
    public TranslateSourceAll = TranslateSourceAllOrigin;
    public BasicState = BasicStateOrigin;
    public Global = GlobalOrigin;
    public AppRoute = AppRouteOrigin;
    public ApiClassName = ApiClassNameOrigin;
    public nodes: Nodes = {};
    public nodeHandlers: NodeHandlers = {};
    public constructorName;
    constructor() {
        this.constructorName = this.constructor.name;
    }


    ngOnDestroy() {
        this.interruptNode();
    }

    /**
     * 監聽StoreNode改變
     * @param node
     * @param handler
     * @param auto 第一次監聽立即執行
     */
    protected listenNode(node: StoreNode<any>, handler: IStoreListener, auto?: boolean) {
        node.listen(handler, auto);
        let id = node.getId();
        this.nodes[id] = node;

        let handlers = this.nodeHandlers[id];
        if (!handlers) {
            this.nodeHandlers[id] = handlers = [];
        }
        handlers.push(handler);
    }

    /**
     * 中斷StoreNode改變監聽
     */
    private interruptNode() {
        let node: StoreNode<any>;
        let handlers: IStoreListener[];
        for (let id in this.nodes) {
            node = this.nodes[id];
            handlers = this.nodeHandlers[id];
            for (let i in handlers) {
                node.interrupt(handlers[i]);
            }
        }
    }
}
