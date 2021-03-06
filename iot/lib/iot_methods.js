/*!
Copyright Caf.js Labs LLC and contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
'use strict';

const caf_iot = require('caf_iot');
const myUtils = caf_iot.caf_components.myUtils;

exports.methods = {
    async __iot_setup__() {
        /* Example of how to store device state in the cloud, i.e.,
         * the value of `index` from the last run. */
        const lastIndex = this.toCloud.get('index');
        this.state.index = (lastIndex ? lastIndex : 0);

        const meta = this.fromCloud.get('meta') || {};
        this.$.log && this.$.log.debug(JSON.stringify(meta));
        this.$.gpio.setPinConfig(meta);
        this.state.meta = meta;

        return [];
    },

    async __iot_loop__() {
        this.$.log && this.$.log.debug(
            `Time offset ${this.$.cloud.cli.getEstimatedTimeOffset()}`
        );

        // Setup new pin
        const meta = this.fromCloud.get('meta');
        if (meta && !myUtils.deepEqual(meta, this.state.meta)) {
            this.$.log && this.$.log.debug(JSON.stringify(meta));
            this.$.gpio.setPinConfig(meta);
            this.state.meta = meta;
        }

        // Store device state in the cloud
        this.toCloud.set('index', this.state.index);
        this.state.index = this.state.index + 1;

        const now = (new Date()).getTime();
        this.$.log && this.$.log.debug(`${now} loop: ${this.state.index}`);

        // Simulate sensor data to be uploaded
        if (this.state.index % this.$.props.divisorIOT === 0) {
            this.toCloud.set('deviceInfo', this.state.index);
        }

        return [];
    },

    //Method invoked by the cloud
    async setPin(pin, value) {
        const now = (new Date()).getTime();
        this.$.log && this.$.log.debug(`${now} setPin: ${pin} value: ${value}`);
        const pins = {};
        pins[pin] = value;
        this.$.gpio.writeMany(pins);
        return [];
    }
};

caf_iot.init(module);
