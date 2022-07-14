package surf.express.nord.proton.vpn.presentation.ui.newpassword

import android.view.View
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentNewPasswordBinding
import surf.express.nord.proton.vpn.presentation.base.BaseFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class NewPasswordFragment :
    BaseFragment<FragmentNewPasswordBinding>(R.layout.fragment_new_password) {

    override fun initBinding(view: View): FragmentNewPasswordBinding {
        return FragmentNewPasswordBinding.bind(view)
    }

    override fun initView() {
    }
}