from django.apps import AppConfig


class NfcReaderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'nfc'
    already_started = False

    def ready(self) -> None:
        """Start the NFC waiting thread upon Django startup after all initialization is done"""
        if not self.already_started:  # Prevent double running of this block in some cases
            # TODO: This block is still run twice in development mode, see https://stackoverflow.com/a/48094491
            self.already_started = True
            from nfc.nfc import Acr122uWaitingThread
            print("Starting Acr122uWaitingThread")
            nfc_waiting_service = Acr122uWaitingThread()
            nfc_waiting_service.start()
