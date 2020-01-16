import { grpc } from '@improbable-eng/grpc-web'
import * as pb from 'protobufjs'

export abstract class MockServiceHandler {
	metadata?: grpc.Metadata

	constructor(metadata?: grpc.Metadata) {
		this.metadata = metadata
	}
}

export interface MockServiceHandlerCtor {
	new (metadata?: grpc.Metadata): MockServiceHandler
}

export type MockBridge = (
	ServiceCtor: MockServiceHandlerCtor,
	metadata?: grpc.Metadata,
) => pb.RPCImpl

export const mockBridge: MockBridge = (ServiceCtor, metadata) => {
	const service = new ServiceCtor(metadata)
	return (method, requestData, callback) => {
		if (!(method instanceof pb.Method)) {
			console.error("GRPC MockBridge: bridge doesn't support protobuf.rpc.ServiceMethod")
			return
		}

		if (typeof (service as { [key: string]: any })[method.name] !== 'function') {
			console.error(`
				GRPC MockBridge: ${service.constructor.name}: method ${method.name} does not exists
			`)
		}

		ServiceCtor.prototype[method.name].call(
			service,
			method?.resolvedRequestType?.decode(requestData),
			(error?: Error | null, responseData?: {} | null) => {
				if (error != null) {
					console.warn(
						`GRPC MockBridge: ${service.constructor.name}: method ${method.name} ${error.message}`,
						error.stack,
					)
				}
				callback(
					error || null,
					responseData ? method?.resolvedResponseType?.encode(responseData).finish() : null,
				)
			},
		)
	}
}